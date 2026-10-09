import { inject, injectable } from "tsyringe";

import { PaginatedDto } from "../../../../shared/dtos/paginated-dto";
import { HarvestProps } from "../../domain/entities/harvest";
import {
  HARVEST_REPOSITORY,
  HarvestRepository,
} from "../../domain/repositories/harvest-repository";
import { ListHarvestsDto } from "../dtos/list-harvests-dto";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

@injectable()
export class ListHarvestsUseCase {
  constructor(
    @inject(HARVEST_REPOSITORY)
    private readonly harvestRepository: HarvestRepository,
  ) {}

  async execute(input: ListHarvestsDto): Promise<PaginatedDto<HarvestProps>> {
    const page = input.page ?? DEFAULT_PAGE;
    const limit = input.limit ?? DEFAULT_LIMIT;

    const search = input.search?.trim() || undefined;
    const result = await this.harvestRepository.findMany({
      page,
      limit,
      search,
      includeDeleted: input.includeDeleted ?? false,
    });

    return {
      data: result.harvests.map((harvest) => harvest.toObject()),
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
