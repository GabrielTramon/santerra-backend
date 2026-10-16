import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { MemberProps } from "../../domain/entities/member";
import {
  MEMBER_REPOSITORY,
  MemberRepository,
} from "../../domain/repositories/member-repository";

@injectable()
export class GetMemberUseCase {
  constructor(
    @inject(MEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepository,
  ) {}

  async execute(id: string, context: TenantContext): Promise<MemberProps> {
    const member = await this.memberRepository.findById(id, context.companyId);

    if (!member) {
      throw new ResourceNotFoundError("Membro não encontrado.");
    }

    return member.toObject();
  }
}
