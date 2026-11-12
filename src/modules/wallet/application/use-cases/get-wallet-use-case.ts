import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { WalletProps } from "../../domain/entities/wallet";
import {
  WALLET_REPOSITORY,
  WalletRepository,
} from "../../domain/repositories/wallet-repository";

@injectable()
export class GetWalletUseCase {
  constructor(
    @inject(WALLET_REPOSITORY)
    private readonly walletRepository: WalletRepository,
  ) {}

  async execute(id: string, context: TenantContext): Promise<WalletProps> {
    const wallet = await this.walletRepository.findById(id, context.companyId);

    if (!wallet) {
      throw new ResourceNotFoundError("Carteira não encontrada.");
    }

    return wallet.toObject();
  }
}
