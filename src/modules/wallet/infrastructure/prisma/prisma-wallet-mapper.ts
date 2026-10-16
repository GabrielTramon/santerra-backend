import { Wallet as PrismaWallet } from "@prisma/client";

import { Wallet } from "../../domain/entities/wallet";

export class PrismaWalletMapper {
  static toDomain(raw: PrismaWallet): Wallet {
    return Wallet.reconstitute({
      id: raw.id,
      value: raw.value.toNumber(),
      userCompanyId: raw.userCompanyId,
      companyId: raw.companyId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      createdById: raw.createdById,
      updatedById: raw.updatedById,
      deletedById: raw.deletedById,
    });
  }
}
