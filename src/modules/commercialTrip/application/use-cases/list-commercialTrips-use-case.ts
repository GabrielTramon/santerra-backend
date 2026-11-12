import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { PaginatedDto } from "../../../../shared/dtos/paginated-dto";
import { CommercialTripProps } from "../../domain/entities/commercialTrip";
import {
  COMMERCIAL_TRIP_REPOSITORY,
  CommercialTripRepository,
} from "../../domain/repositories/commercialTrip-repository";
import { ListCommercialTripsDto } from "../dtos/list-commercialTrips-dto";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

@injectable()
export class ListCommercialTripsUseCase {
  constructor(
    @inject(COMMERCIAL_TRIP_REPOSITORY)
    private readonly commercialTripRepository: CommercialTripRepository,
  ) {}

  async execute(
    input: ListCommercialTripsDto,
    context: TenantContext,
  ): Promise<PaginatedDto<CommercialTripProps>> {
    const page = input.page ?? DEFAULT_PAGE;
    const limit = input.limit ?? DEFAULT_LIMIT;

    const search = input.search?.trim() || undefined;
    const result = await this.commercialTripRepository.findMany({
      companyId: context.companyId,
      page,
      limit,
      search,
      includeDeleted: input.includeDeleted ?? false,
    });

    return {
      data: result.commercialTrips.map((commercialTrip) => commercialTrip.toObject()),
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
