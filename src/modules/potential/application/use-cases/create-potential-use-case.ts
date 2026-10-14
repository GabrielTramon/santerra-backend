import { inject, injectable } from "tsyringe";

import { Potential, PotentialProps } from "../../domain/entities/potential";
import {
  POTENTIAL_REPOSITORY,
  PotentialRepository,
} from "../../domain/repositories/potential-repository";
import { CreatePotentialDto } from "../dtos/create-potential-dto";

@injectable()
export class CreatePotentialUseCase {
  constructor(
    @inject(POTENTIAL_REPOSITORY)
    private readonly potentialRepository: PotentialRepository,
  ) {}

  async execute(input: CreatePotentialDto): Promise<PotentialProps> {
    const potential = Potential.create(input);
    const createdPotential = await this.potentialRepository.create(potential);

    return createdPotential.toObject();
  }
}
