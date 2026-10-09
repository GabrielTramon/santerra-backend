import { inject, injectable } from "tsyringe";

import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { HarvestProps } from "../../domain/entities/harvest";
import {
  HARVEST_REPOSITORY,
  HarvestRepository,
} from "../../domain/repositories/harvest-repository";

@injectable()
export class GetHarvestUseCase {
  constructor(
    @inject(HARVEST_REPOSITORY)
    private readonly harvestRepository: HarvestRepository,
  ) {}

  async execute(id: string): Promise<HarvestProps> {
    const harvest = await this.harvestRepository.findById(id);

    if (!harvest) {
      throw new ResourceNotFoundError("Produção");
    }

    return harvest.toObject();
  }
}
