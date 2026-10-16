import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { MEMBER_REPOSITORY, MemberRepository } from "../../../member";
import { WalletProps } from "../../domain/entities/wallet";
import {
  WALLET_REPOSITORY,
  WalletRepository,
} from "../../domain/repositories/wallet-repository";
import { UpdateWalletDto } from "../dtos/update-wallet-dto";

@injectable()
export class UpdateWalletUseCase {
  constructor(
    @inject(WALLET_REPOSITORY)
    private readonly walletRepository: WalletRepository,
    @inject(MEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateWalletDto,
    context: TenantContext,
  ): Promise<WalletProps> {
    const wallet = await this.walletRepository.findById(id, context.companyId);

    if (!wallet) {
      throw new ResourceNotFoundError("Carteira não encontrada.");
    }

    wallet.update({ ...input, updatedById: context.userId });

    if (
      input.userCompanyId !== undefined &&
      !(await this.memberRepository.findById(wallet.userCompanyId, context.companyId))
    ) {
      throw new ResourceNotFoundError("Membro não encontrado.");
    }

    const updatedWallet = await this.walletRepository.update(wallet);

    return updatedWallet.toObject();
  }
}
