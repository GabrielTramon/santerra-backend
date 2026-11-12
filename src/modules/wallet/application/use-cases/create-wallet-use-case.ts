import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { MEMBER_REPOSITORY, MemberRepository } from "../../../member";
import { Wallet, WalletProps } from "../../domain/entities/wallet";
import {
  WALLET_REPOSITORY,
  WalletRepository,
} from "../../domain/repositories/wallet-repository";
import { CreateWalletDto } from "../dtos/create-wallet-dto";

@injectable()
export class CreateWalletUseCase {
  constructor(
    @inject(WALLET_REPOSITORY)
    private readonly walletRepository: WalletRepository,
    @inject(MEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepository,
  ) {}

  async execute(
    input: CreateWalletDto,
    context: TenantContext,
  ): Promise<WalletProps> {
    const wallet = Wallet.create({
      ...input,
      companyId: context.companyId,
      createdById: context.userId,
    });

    if (!(await this.memberRepository.findById(wallet.userCompanyId, context.companyId))) {
      throw new ResourceNotFoundError("Membro não encontrado.");
    }

    const createdWallet = await this.walletRepository.create(wallet);

    return createdWallet.toObject();
  }
}
