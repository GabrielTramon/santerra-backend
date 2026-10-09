import { inject, injectable } from "tsyringe";

import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import {
  ROLE_REPOSITORY,
  RoleRepository,
} from "../../domain/repositories/role-repository";

@injectable()
export class DeleteRoleUseCase {
  constructor(
    @inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new ResourceNotFoundError("Cargo");
    }

    role.delete();
    await this.roleRepository.delete(role);
  }
}
