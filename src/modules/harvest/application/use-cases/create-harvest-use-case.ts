import { inject, injectable } from "tsyringe";

import { AuthContext } from "../../../../shared/application/auth/auth-context";
import { Harvest, HarvestProps } from "../../domain/entities/harvest";
import {
  HARVEST_REPOSITORY,
  HarvestRepository,
} from "../../domain/repositories/harvest-repository";
import { CreateHarvestDto } from "../dtos/create-harvest-dto";

@injectable()
export class CreateHarvestUseCase {
  constructor(
    @inject(HARVEST_REPOSITORY)
    private readonly harvestRepository: HarvestRepository,
  ) {}

  async execute(
    input: CreateHarvestDto,
    context: AuthContext,
  ): Promise<HarvestProps> {
    const harvest = Harvest.create({ ...input, createdById: context.userId });
    const createdHarvest = await this.harvestRepository.create(harvest);

    return createdHarvest.toObject();
  }
}
