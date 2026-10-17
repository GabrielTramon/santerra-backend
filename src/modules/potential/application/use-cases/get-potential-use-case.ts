import { inject, injectable } from "tsyringe";

import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { PotentialProps } from "../../domain/entities/potential";
import {
  POTENTIAL_REPOSITORY,
  PotentialRepository,
} from "../../domain/repositories/potential-repository";

@injectable()
export class GetPotentialUseCase {
  constructor(
    @inject(POTENTIAL_REPOSITORY)
    private readonly potentialRepository: PotentialRepository,
  ) {}

  async execute(id: string): Promise<PotentialProps> {
    const potential = await this.potentialRepository.findById(id);

    if (!potential) {
      throw new ResourceNotFoundError("Potencial");
    }

    return potential.toObject();
  }
}
