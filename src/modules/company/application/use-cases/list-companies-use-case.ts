import { inject, injectable } from "tsyringe";

import { PaginatedDto } from "../../../../shared/dtos/paginated-dto";
import { ValidationError } from "../../../../shared/errors/app-error";
import { CompanyProps } from "../../domain/entities/company";
import {
  COMPANY_REPOSITORY,
  CompanyRepository,
} from "../../domain/repositories/company-repository";
import { ListCompaniesDto } from "../dtos/list-companies-dto";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

@injectable()
export class ListCompaniesUseCase {
  constructor(
    @inject(COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(input: ListCompaniesDto): Promise<PaginatedDto<CompanyProps>> {
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
    const result = await this.companyRepository.findMany({
      page,
      limit,
      search,
      includeDeleted: input.includeDeleted ?? false,
    });

    return {
      data: result.companies.map((company) => company.toObject()),
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
