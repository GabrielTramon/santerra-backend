import { inject, injectable } from "tsyringe";

import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import {
  MANUFACTURER_REPOSITORY,
  ManufacturerRepository,
} from "../../domain/repositories/manufacturer-repository";

@injectable()
export class DeleteManufacturerUseCase {
  constructor(
    @inject(MANUFACTURER_REPOSITORY)
    private readonly manufacturerRepository: ManufacturerRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const manufacturer = await this.manufacturerRepository.findById(id);

    if (!manufacturer) {
      throw new ResourceNotFoundError("Fabricante");
    }

    manufacturer.delete();
    await this.manufacturerRepository.delete(manufacturer);
  }
}
