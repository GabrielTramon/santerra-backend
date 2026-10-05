import { inject, injectable } from "tsyringe";

import { PaginatedDto } from "../../../../shared/dtos/paginated-dto";
import { ValidationError } from "../../../../shared/errors/app-error";
import { ManufacturerProps } from "../../domain/entities/manufacturer";
import {
  MANUFACTURER_REPOSITORY,
  ManufacturerRepository,
} from "../../domain/repositories/manufacturer-repository";
import { ListManufacturersDto } from "../dtos/list-manufacturers-dto";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

@injectable()
export class ListManufacturersUseCase {
  constructor(
    @inject(MANUFACTURER_REPOSITORY)
    private readonly manufacturerRepository: ManufacturerRepository,
  ) {}

  async execute(input: ListManufacturersDto): Promise<PaginatedDto<ManufacturerProps>> {
    const page = input.page ?? DEFAULT_PAGE;
    const limit = input.limit ?? DEFAULT_LIMIT;

    if (!Number.isInteger(page) || page < 1) {
      throw new ValidationError("O campo 'page' deve ser um inteiro maior que zero.");
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
      throw new ValidationError(
        `O campo 'limit' deve ser um inteiro entre 1 e ${MAX_LIMIT}.`,
      );
    }

    const search = input.search?.trim() || undefined;
    const result = await this.manufacturerRepository.findMany({
      page,
      limit,
      search,
      includeDeleted: input.includeDeleted ?? false,
    });

    return {
      data: result.manufacturers.map((manufacturer) => manufacturer.toObject()),
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
