import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { CommercialTripProps } from "../../domain/entities/commercialTrip";
import {
  COMMERCIAL_TRIP_REPOSITORY,
  CommercialTripRepository,
} from "../../domain/repositories/commercialTrip-repository";
import { UpdateCommercialTripDto } from "../dtos/update-commercialTrip-dto";

@injectable()
export class UpdateCommercialTripUseCase {
  constructor(
    @inject(COMMERCIAL_TRIP_REPOSITORY)
    private readonly commercialTripRepository: CommercialTripRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateCommercialTripDto,
    context: TenantContext,
  ): Promise<CommercialTripProps> {
    const commercialTrip = await this.commercialTripRepository.findById(id, context.companyId);

    if (!commercialTrip) {
      throw new ResourceNotFoundError("Viagem comercial não encontrada.");
    }

    commercialTrip.update({ ...input, updatedById: context.userId });
    const updatedCommercialTrip = await this.commercialTripRepository.update(commercialTrip);

    return updatedCommercialTrip.toObject();
  }
}
