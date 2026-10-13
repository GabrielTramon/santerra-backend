import { inject, injectable } from "tsyringe";

import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import {
  RESELLER_REPOSITORY,
  ResellerRepository,
} from "../../domain/repositories/reseller-repository";

@injectable()
export class DeleteResellerUseCase {
  constructor(
    @inject(RESELLER_REPOSITORY)
    private readonly resellerRepository: ResellerRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const reseller = await this.resellerRepository.findById(id);

    if (!reseller) {
      throw new ResourceNotFoundError("Revendedor");
    }

    reseller.delete();
    await this.resellerRepository.delete(reseller);
  }
}
