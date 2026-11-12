import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import {
  ConflictError,
  ResourceNotFoundError,
} from "../../../../shared/errors/app-error";
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

  async execute(
    id: string,
    input: UpdateResellerDto,
    context: TenantContext,
  ): Promise<ResellerProps> {
    const reseller = await this.resellerRepository.findById(id, context.companyId);

    if (!reseller) {
      throw new ResourceNotFoundError("Revendedor não encontrado.");
    }

    reseller.update({ ...input, updatedById: context.userId });

    if (input.registrationNumber && reseller.registrationNumber) {
      const owner = await this.resellerRepository.findByRegistrationNumber(
        reseller.registrationNumber,
        context.companyId,
      );

      if (owner && owner.id !== reseller.id) {
        throw new ConflictError("Já existe um revendedor com este documento.");
      }
    }

    const updatedReseller = await this.resellerRepository.update(reseller);

    return updatedReseller.toObject();
  }
}
