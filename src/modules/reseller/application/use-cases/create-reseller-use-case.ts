import { inject, injectable } from "tsyringe";

import { Reseller, ResellerProps } from "../../domain/entities/reseller";
import {
  RESELLER_REPOSITORY,
  ResellerRepository,
} from "../../domain/repositories/reseller-repository";
import { CreateResellerDto } from "../dtos/create-reseller-dto";

@injectable()
export class CreateResellerUseCase {
  constructor(
    @inject(RESELLER_REPOSITORY)
    private readonly resellerRepository: ResellerRepository,
  ) {}

  async execute(input: CreateResellerDto): Promise<ResellerProps> {
    const reseller = Reseller.create(input);
    const createdReseller = await this.resellerRepository.create(reseller);

    return createdReseller.toObject();
  }
}
