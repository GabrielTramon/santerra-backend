import { inject, injectable } from "tsyringe";

import {
  ResourceNotFoundError,
  ValidationError,
} from "../../../../shared/errors/app-error";
import { ensureUuid } from "../../../../shared/validation/uuid";
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
    ensureUuid(id);

    if (
      input.name === undefined &&
      input.registrationNumber === undefined &&
      input.phoneNumber === undefined &&
      input.email === undefined &&
      input.passwordHash === undefined
    ) {
      throw new ValidationError("Informe ao menos um campo para atualizar.");
    }

    const manufacturer = await this.manufacturerRepository.findById(id);

    if (!manufacturer) {
      throw new ResourceNotFoundError("Fabricante");
    }

    manufacturer.update(input);
    const updatedManufacturer = await this.manufacturerRepository.update(manufacturer);

    return updatedManufacturer.toObject();
  }
}
