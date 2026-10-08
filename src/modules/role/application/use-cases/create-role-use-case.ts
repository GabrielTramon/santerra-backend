import { inject, injectable } from "tsyringe";

import { Role, RoleProps } from "../../domain/entities/role";
import {
  ROLE_REPOSITORY,
  RoleRepository,
} from "../../domain/repositories/role-repository";
import { CreateRoleDto } from "../dtos/create-role-dto";

@injectable()
export class CreateRoleUseCase {
  constructor(
    @inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,
  ) {}

  async execute(input: CreateRoleDto): Promise<RoleProps> {
    const role = Role.create(input);
    const createdRole = await this.roleRepository.create(role);

    return createdRole.toObject();
  }
}
