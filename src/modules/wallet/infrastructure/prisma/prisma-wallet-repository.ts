import { Prisma, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

import { Wallet } from "../../domain/entities/wallet";
import {
  WalletRepository,
  FindWalletsParams,
  FindWalletsResult,
} from "../../domain/repositories/wallet-repository";
import { PrismaWalletMapper } from "./prisma-wallet-mapper";

@injectable()
export class PrismaWalletRepository implements WalletRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(wallet: Wallet): Promise<Wallet> {
    const data = wallet.toObject();
    const createdWallet = await this.prisma.wallet.create({ data });

    return PrismaWalletMapper.toDomain(createdWallet);
  }

  async findById(
    id: string,
    companyId: string,
    includeDeleted = false,
  ): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findFirst({
      where: {
        id,
        companyId,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return wallet ? PrismaWalletMapper.toDomain(wallet) : null;
  }

  async findMany(params: FindWalletsParams): Promise<FindWalletsResult> {
    const where: Prisma.WalletWhereInput = {
      companyId: params.companyId,
      userCompanyId: params.userCompanyId,
      deletedAt: params.includeDeleted ? undefined : null,
      userCompany: params.search
        ? {
            user: {
              OR: [
                { name: { contains: params.search, mode: "insensitive" } },
                { email: { contains: params.search, mode: "insensitive" } },
              ],
            },
          }
        : undefined,
    };

    const [wallets, total] = await this.prisma.$transaction([
      this.prisma.wallet.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.prisma.wallet.count({ where }),
    ]);

    return {
      wallets: wallets.map(PrismaWalletMapper.toDomain),
      total,
    };
  }

  async update(wallet: Wallet): Promise<Wallet> {
    const data = wallet.toObject();
    const updatedWallet = await this.prisma.wallet.update({
      where: {
        id: data.id,
        companyId: data.companyId,
        deletedAt: null,
      },
      data: {
        value: data.value,
        userCompanyId: data.userCompanyId,
        updatedAt: data.updatedAt,
        updatedById: data.updatedById,
      },
    });

    return PrismaWalletMapper.toDomain(updatedWallet);
  }

  async delete(wallet: Wallet): Promise<void> {
    const data = wallet.toObject();

    await this.prisma.wallet.update({
      where: {
        id: data.id,
        companyId: data.companyId,
        deletedAt: null,
      },
      data: {
        deletedAt: data.deletedAt,
        deletedById: data.deletedById,
      },
    });
  }

  async debitValue(
    walletId: string,
    companyId: string,
    amount: number,
  ): Promise<boolean> {
    const result = await this.prisma.wallet.updateMany({
      where: {
        id: walletId,
        companyId: companyId,
      },
      data: {
        value: {
          decrement: amount,
        },
      },
    })

    return result.count > 0;
  }
}
