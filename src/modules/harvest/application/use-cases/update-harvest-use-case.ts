import { inject, injectable } from "tsyringe";

import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { HarvestProps } from "../../domain/entities/harvest";
import {
  HARVEST_REPOSITORY,
  HarvestRepository,
} from "../../domain/repositories/harvest-repository";
import { UpdateHarvestDto } from "../dtos/update-harvest-dto";

@injectable()
export class UpdateHarvestUseCase {
  constructor(
    @inject(HARVEST_REPOSITORY)
    private readonly harvestRepository: HarvestRepository,
  ) {}

  async execute(id: string, input: UpdateHarvestDto): Promise<HarvestProps> {
    const harvest = await this.harvestRepository.findById(id);

    if (!harvest) {
      throw new ResourceNotFoundError("Colheita");
    }

    harvest.update(input);
    const updatedHarvest = await this.harvestRepository.update(harvest);

    return updatedHarvest.toObject();
  }
}
