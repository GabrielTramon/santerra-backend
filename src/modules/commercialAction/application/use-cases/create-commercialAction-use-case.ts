import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { CommercialAction, CommercialActionProps } from "../../domain/entities/commercialAction";
import {
  COMMERCIAL_ACTION_REPOSITORY,
  CommercialActionRepository,
} from "../../domain/repositories/commercialAction-repository";
import { CreateCommercialActionDto } from "../dtos/create-commercialAction-dto";
import { DebitWalletUseCase } from "../../../wallet/application/use-cases/debit-wallet-use-case";

@injectable()
export class CreateCommercialActionUseCase {
  constructor(
    @inject(COMMERCIAL_ACTION_REPOSITORY)
    private readonly commercialActionRepository: CommercialActionRepository,
    private readonly debitWalletUseCase: DebitWalletUseCase,
  ) {}

  async execute(
    input: CreateCommercialActionDto,
    context: TenantContext,
  ): Promise<CommercialActionProps> {
    
    await this.debitWalletUseCase.execute(
      {
        walletId: input.walletId,
        amount: input.price ?? 0,
      },
      context
    )
    
    const commercialAction = CommercialAction.create({
      ...input,
      companyId: context.companyId,
      createdById: context.userId,
    });
    const createdCommercialAction = await this.commercialActionRepository.create(commercialAction);

    return createdCommercialAction.toObject();
  }
}
