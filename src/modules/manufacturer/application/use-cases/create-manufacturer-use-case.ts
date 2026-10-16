import { inject, injectable } from "tsyringe";

import { AuthContext } from "../../../../shared/application/auth/auth-context";
import {
  Manufacturer,
  PublicManufacturerProps,
} from "../../domain/entities/manufacturer";
import {
  MANUFACTURER_REPOSITORY,
  ManufacturerRepository,
} from "../../domain/repositories/manufacturer-repository";
import { CreateManufacturerDto } from "../dtos/create-manufacturer-dto";

@injectable()
export class CreateManufacturerUseCase {
  constructor(
    @inject(MANUFACTURER_REPOSITORY)
    private readonly manufacturerRepository: ManufacturerRepository,
  ) {}


  async execute(
    input: CreateManufacturerDto,
    context: AuthContext,
  ): Promise<PublicManufacturerProps> {
    const manufacturer = Manufacturer.create({
      ...input,
      createdById: context.userId,
    });
    const createdManufacturer = await this.manufacturerRepository.create(manufacturer);

    return createdManufacturer.toPublicObject();
  }
}
