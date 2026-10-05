import { inject, injectable } from "tsyringe";

import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { ManufacturerProps } from "../../domain/entities/manufacturer";
import {
  MANUFACTURER_REPOSITORY,
  ManufacturerRepository,
} from "../../domain/repositories/manufacturer-repository";
import { UpdateManufacturerDto } from "../dtos/update-manufacturer-dto";

@injectable()
export class UpdateManufacturerUseCase {
  constructor(
    @inject(MANUFACTURER_REPOSITORY)
    private readonly manufacturerRepository: ManufacturerRepository,
  ) {}

  async execute(id: string, input: UpdateManufacturerDto): Promise<ManufacturerProps> {
    const manufacturer = await this.manufacturerRepository.findById(id);

    if (!manufacturer) {
      throw new ResourceNotFoundError("Fabricante");
    }

    manufacturer.update(input);
    const updatedManufacturer = await this.manufacturerRepository.update(manufacturer);

    return updatedManufacturer.toObject();
  }
}
