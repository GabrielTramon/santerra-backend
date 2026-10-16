import "./wallet-container";

export { Wallet } from "./domain/entities/wallet";
export { WALLET_REPOSITORY } from "./domain/repositories/wallet-repository";
export type { WalletRepository } from "./domain/repositories/wallet-repository";
export { walletRouter } from "./presentation/http/wallet-routes";
