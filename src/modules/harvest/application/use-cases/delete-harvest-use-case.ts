import { inject, injectable } from "tsyringe";

import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import {
  HARVEST_REPOSITORY,
  HarvestRepository,
} from "../../domain/repositories/harvest-repository";

@injectable()
export class DeleteHarvestUseCase {
  constructor(
    @inject(HARVEST_REPOSITORY)
    private readonly harvestRepository: HarvestRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const harvest = await this.harvestRepository.findById(id);

    if (!harvest) {
      throw new ResourceNotFoundError("Produção");
    }

    harvest.delete();
    await this.harvestRepository.delete(harvest);
  }
}
