import { Wallet } from "../entities/wallet";

export const WALLET_REPOSITORY = "WalletRepository";

export interface FindWalletsParams {
  companyId: string;
  page: number;
  limit: number;
  search?: string;
  userCompanyId?: string;
  includeDeleted: boolean;
}

export interface FindWalletsResult {
  wallets: Wallet[];
  total: number;
}

export interface WalletRepository {
  create(wallet: Wallet): Promise<Wallet>;
  findById(
    id: string,
    companyId: string,
    includeDeleted?: boolean,
  ): Promise<Wallet | null>;
  findMany(params: FindWalletsParams): Promise<FindWalletsResult>;
  update(wallet: Wallet): Promise<Wallet>;
  delete(wallet: Wallet): Promise<void>;
  debitValue(
    walletId: string,
    companyId: string,
    amount: number,
  ): Promise<boolean>;
}
