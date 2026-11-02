import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { Group, GroupProps } from "../../domain/entities/group";
import {
  GROUP_REPOSITORY,
  GroupRepository,
} from "../../domain/repositories/group-repository";
import { CreateGroupDto } from "../dtos/create-group-dto";

@injectable()
export class CreateGroupUseCase {
  constructor(
    @inject(GROUP_REPOSITORY)
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(
    input: CreateGroupDto,
    context: TenantContext,
  ): Promise<GroupProps> {
    const group = Group.create({
      ...input,
      companyId: context.companyId,
      createdById: context.userId,
    });
    const createdGroup = await this.groupRepository.create(group);

    return createdGroup.toObject();
  }
}
