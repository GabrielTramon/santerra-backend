import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { CommercialTrip, CommercialTripProps } from "../../domain/entities/commercialTrip";
import {
  COMMERCIAL_TRIP_REPOSITORY,
  CommercialTripRepository,
} from "../../domain/repositories/commercialTrip-repository";
import { CreateCommercialTripDto } from "../dtos/create-commercialTrip-dto";

@injectable()
export class CreateCommercialTripUseCase {
  constructor(
    @inject(COMMERCIAL_TRIP_REPOSITORY)
    private readonly commercialTripRepository: CommercialTripRepository,
  ) {}

  async execute(
    input: CreateCommercialTripDto,
    context: TenantContext,
  ): Promise<CommercialTripProps> {
    const commercialTrip = CommercialTrip.create({
      ...input,
      companyId: context.companyId,
      createdById: context.userId,
    });
    const createdCommercialTrip = await this.commercialTripRepository.create(commercialTrip);

    return createdCommercialTrip.toObject();
  }
}
