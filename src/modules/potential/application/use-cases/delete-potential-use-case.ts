import { inject, injectable } from "tsyringe";

import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import {
  POTENTIAL_REPOSITORY,
  PotentialRepository,
} from "../../domain/repositories/potential-repository";

@injectable()
export class DeletePotentialUseCase {
  constructor(
    @inject(POTENTIAL_REPOSITORY)
    private readonly potentialRepository: PotentialRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const potential = await this.potentialRepository.findById(id);

    if (!potential) {
      throw new ResourceNotFoundError("Potencial");
    }

    potential.delete();
    await this.potentialRepository.delete(potential);
  }
}
