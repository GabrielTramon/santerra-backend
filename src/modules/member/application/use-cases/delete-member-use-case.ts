import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import {
  ForbiddenError,
  ResourceNotFoundError,
} from "../../../../shared/errors/app-error";
import { PermissionScope } from "../../../permission";
import { ROLE_REPOSITORY, RoleRepository } from "../../../role";
import {
  MEMBER_REPOSITORY,
  MemberRepository,
} from "../../domain/repositories/member-repository";

@injectable()
export class DeleteMemberUseCase {
  constructor(
    @inject(MEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepository,
    @inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,
    private readonly permissionScope: PermissionScope,
  ) {}

  async execute(id: string, context: TenantContext): Promise<void> {
    const member = await this.memberRepository.findById(id, context.companyId);

    if (!member) {
      throw new ResourceNotFoundError("Membro não encontrado.");
    }

    if (member.isOwner) {
      throw new ForbiddenError("O dono da empresa não pode ser alterado nem removido.");
    }

    if (member.userId === context.userId) {
      throw new ForbiddenError("Você não pode remover a si mesmo da empresa.");
    }

    const roles = await this.roleRepository.findManyByIds(
      member.roleIds,
      context.companyId,
    );
    await this.permissionScope.ensureWithin(
      roles.flatMap((role) => role.permissionIds),
      context,
    );

    member.delete(context.userId);
    await this.memberRepository.delete(member);
  }
}
