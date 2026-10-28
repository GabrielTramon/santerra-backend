import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { CommercialTripProps } from "../../domain/entities/commercialTrip";
import {
  COMMERCIAL_TRIP_REPOSITORY,
  CommercialTripRepository,
} from "../../domain/repositories/commercialTrip-repository";

@injectable()
export class GetCommercialTripUseCase {
  constructor(
    @inject(COMMERCIAL_TRIP_REPOSITORY)
    private readonly commercialTripRepository: CommercialTripRepository,
  ) {}

  async execute(id: string, context: TenantContext): Promise<CommercialTripProps> {
    const commercialTrip = await this.commercialTripRepository.findById(id, context.companyId);

    if (!commercialTrip) {
      throw new ResourceNotFoundError("Viagem comercial não encontrada.");
    }

    return commercialTrip.toObject();
  }
}
