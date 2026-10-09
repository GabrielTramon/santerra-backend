import { inject, injectable } from "tsyringe";

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

  async execute(input: CreateHarvestDto): Promise<HarvestProps> {
    const harvest = Harvest.create(input);
    const createdHarvest = await this.harvestRepository.create(harvest);

    return createdHarvest.toObject();
  }
}
