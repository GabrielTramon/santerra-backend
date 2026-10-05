import { inject, injectable } from "tsyringe";

import { Manufacturer, ManufacturerProps } from "../../domain/entities/manufacturer";
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


  async execute(input: CreateManufacturerDto): Promise<ManufacturerProps> {
    const manufacturer = Manufacturer.create(input);
    const createdManufacturer = await this.manufacturerRepository.create(manufacturer);

    return createdManufacturer.toObject();
  }
}
