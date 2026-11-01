import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import {
    WALLET_REPOSITORY,
    WalletRepository
} from "../../domain/repositories/wallet-repository";
import { DebitWalletDto } from '../dtos/debit-wallet-dto';

@injectable()
export class DebitWalletUseCase {
    constructor(
        @inject(WALLET_REPOSITORY)
        private readonly walletRepository: WalletRepository,
    ) { }

    async execute(
        input: DebitWalletDto,
        context: TenantContext,
    ): Promise<void> {

        const wallet = await this.walletRepository.findById(input.walletId, context.companyId);

        if (!wallet) {
            throw new ResourceNotFoundError("Carteira não encontrada.");
        }

        if (input.amount < 0) {
            throw new Error("O valor a ser debitado não pode ser negativo.");
        }

        const debited = await this.walletRepository.debitValue(
            input.walletId,
            context.companyId,
            input.amount,
        )

        if (!debited) {
            throw new Error("Não foi possível debitar o saldo da carteira.");
        }
    }
}

