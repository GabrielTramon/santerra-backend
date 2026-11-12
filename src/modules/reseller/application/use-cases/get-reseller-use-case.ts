import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { ResellerProps } from "../../domain/entities/reseller";
import {
  RESELLER_REPOSITORY,
  ResellerRepository,
} from "../../domain/repositories/reseller-repository";

@injectable()
export class GetResellerUseCase {
  constructor(
    @inject(RESELLER_REPOSITORY)
    private readonly resellerRepository: ResellerRepository,
  ) {}

  async execute(id: string, context: TenantContext): Promise<ResellerProps> {
    const reseller = await this.resellerRepository.findById(id, context.companyId);

    if (!reseller) {
      throw new ResourceNotFoundError("Revendedor não encontrado.");
    }

    return reseller.toObject();
  }
}
