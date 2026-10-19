import { inject, injectable } from "tsyringe";

import { PaginatedDto } from "../../../../shared/dtos/paginated-dto";
import { PotentialProps } from "../../domain/entities/potential";
import {
  POTENTIAL_REPOSITORY,
  PotentialRepository,
} from "../../domain/repositories/potential-repository";
import { ListPotentialsDto } from "../dtos/list-potentials-dto";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

@injectable()
export class ListPotentialsUseCase {
  constructor(
    @inject(POTENTIAL_REPOSITORY)
    private readonly potentialRepository: PotentialRepository,
  ) {}

  async execute(input: ListPotentialsDto): Promise<PaginatedDto<PotentialProps>> {
    const page = input.page ?? DEFAULT_PAGE;
    const limit = input.limit ?? DEFAULT_LIMIT;

    const search = input.search?.trim() || undefined;
    const result = await this.potentialRepository.findMany({
      page,
      limit,
      search,
      includeDeleted: input.includeDeleted ?? false,
    });

    return {
      data: result.potentials.map((potential) => potential.toObject()),
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
