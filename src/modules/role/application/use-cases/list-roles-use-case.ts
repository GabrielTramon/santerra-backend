import { inject, injectable } from "tsyringe";

import { PaginatedDto } from "../../../../shared/dtos/paginated-dto";
import { RoleProps } from "../../domain/entities/role";
import {
  ROLE_REPOSITORY,
  RoleRepository,
} from "../../domain/repositories/role-repository";
import { ListRolesDto } from "../dtos/list-roles-dto";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

@injectable()
export class ListRolesUseCase {
  constructor(
    @inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,
  ) {}

  async execute(input: ListRolesDto): Promise<PaginatedDto<RoleProps>> {
    const page = input.page ?? DEFAULT_PAGE;
    const limit = input.limit ?? DEFAULT_LIMIT;

    const search = input.search?.trim() || undefined;
    const result = await this.roleRepository.findMany({
      page,
      limit,
      search,
      includeDeleted: input.includeDeleted ?? false,
    });

    return {
      data: result.roles.map((role) => role.toObject()),
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
