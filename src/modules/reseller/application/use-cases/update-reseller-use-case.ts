import { inject, injectable } from "tsyringe";

import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { ResellerProps } from "../../domain/entities/reseller";
import {
  RESELLER_REPOSITORY,
  ResellerRepository,
} from "../../domain/repositories/reseller-repository";
import { UpdateResellerDto } from "../dtos/update-reseller-dto";

@injectable()
export class UpdateResellerUseCase {
  constructor(
    @inject(RESELLER_REPOSITORY)
    private readonly resellerRepository: ResellerRepository,
  ) {}

  async execute(id: string, input: UpdateResellerDto): Promise<ResellerProps> {
    const reseller = await this.resellerRepository.findById(id);

    if (!reseller) {
      throw new ResourceNotFoundError("Revendedor");
    }

    reseller.update(input);
    const updatedReseller = await this.resellerRepository.update(reseller);

    return updatedReseller.toObject();
  }
}
