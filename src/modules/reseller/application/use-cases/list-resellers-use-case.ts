import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { PaginatedDto } from "../../../../shared/dtos/paginated-dto";
import { ResellerProps } from "../../domain/entities/reseller";
import {
  RESELLER_REPOSITORY,
  ResellerRepository,
} from "../../domain/repositories/reseller-repository";
import { ListResellersDto } from "../dtos/list-resellers-dto";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

@injectable()
export class ListResellersUseCase {
  constructor(
    @inject(RESELLER_REPOSITORY)
    private readonly resellerRepository: ResellerRepository,
  ) {}

  async execute(
    input: ListResellersDto,
    context: TenantContext,
  ): Promise<PaginatedDto<ResellerProps>> {
    const page = input.page ?? DEFAULT_PAGE;
    const limit = input.limit ?? DEFAULT_LIMIT;

    const search = input.search?.trim() || undefined;
    const result = await this.resellerRepository.findMany({
      companyId: context.companyId,
      page,
      limit,
      search,
      includeDeleted: input.includeDeleted ?? false,
    });

    return {
      data: result.resellers.map((reseller) => reseller.toObject()),
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
