import { inject, injectable } from "tsyringe";

import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { PotentialProps } from "../../domain/entities/potential";
import {
  POTENTIAL_REPOSITORY,
  PotentialRepository,
} from "../../domain/repositories/potential-repository";
import { UpdatePotentialDto } from "../dtos/update-potential-dto";

@injectable()
export class UpdatePotentialUseCase {
  constructor(
    @inject(POTENTIAL_REPOSITORY)
    private readonly potentialRepository: PotentialRepository,
  ) {}

  async execute(id: string, input: UpdatePotentialDto): Promise<PotentialProps> {
    const potential = await this.potentialRepository.findById(id);

    if (!potential) {
      throw new ResourceNotFoundError("Potencial");
    }

    potential.update(input);
    const updatedPotential = await this.potentialRepository.update(potential);

    return updatedPotential.toObject();
  }
}
