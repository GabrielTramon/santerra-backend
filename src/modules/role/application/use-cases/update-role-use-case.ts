import { inject, injectable } from "tsyringe";

import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { RoleProps } from "../../domain/entities/role";
import {
  ROLE_REPOSITORY,
  RoleRepository,
} from "../../domain/repositories/role-repository";
import { UpdateRoleDto } from "../dtos/update-role-dto";

@injectable()
export class UpdateRoleUseCase {
  constructor(
    @inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,
  ) {}

  async execute(id: string, input: UpdateRoleDto): Promise<RoleProps> {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new ResourceNotFoundError("Função");
    }

    role.update(input);
    const updatedRole = await this.roleRepository.update(role);

    return updatedRole.toObject();
  }
}
