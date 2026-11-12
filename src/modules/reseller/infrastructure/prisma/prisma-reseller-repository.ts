import { Prisma, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

import { Reseller } from "../../domain/entities/reseller";
import {
  ResellerRepository,
  FindResellersParams,
  FindResellersResult,
} from "../../domain/repositories/reseller-repository";
import { PrismaResellerMapper } from "./prisma-reseller-mapper";

@injectable()
export class PrismaResellerRepository implements ResellerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(reseller: Reseller): Promise<Reseller> {
    const data = reseller.toObject();
    const createdReseller = await this.prisma.reseller.create({ data });

    return PrismaResellerMapper.toDomain(createdReseller);
  }

  async findById(
    id: string,
    companyId: string,
    includeDeleted = false,
  ): Promise<Reseller | null> {
    const reseller = await this.prisma.reseller.findFirst({
      where: {
        id,
        companyId,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return reseller ? PrismaResellerMapper.toDomain(reseller) : null;
  }

  async findByRegistrationNumber(
    registrationNumber: string,
    companyId: string,
  ): Promise<Reseller | null> {
    const reseller = await this.prisma.reseller.findFirst({
      where: {
        registrationNumber,
        companyId,
        deletedAt: null,
      },
    });

    return reseller ? PrismaResellerMapper.toDomain(reseller) : null;
  }

  async findManyByIds(ids: string[], companyId: string): Promise<Reseller[]> {
    const resellers = await this.prisma.reseller.findMany({
      where: {
        id: { in: ids },
        companyId,
        deletedAt: null,
      },
    });

    return resellers.map(PrismaResellerMapper.toDomain);
  }

  async findMany(params: FindResellersParams): Promise<FindResellersResult> {
    const where: Prisma.ResellerWhereInput = {
      companyId: params.companyId,
      deletedAt: params.includeDeleted ? undefined : null,
      OR: params.search
        ? [
            { name: { contains: params.search, mode: "insensitive" } },
            { registrationNumber: { contains: params.search, mode: "insensitive" } },
          ]
        : undefined,
    };

    const [resellers, total] = await this.prisma.$transaction([
      this.prisma.reseller.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.prisma.reseller.count({ where }),
    ]);

    return {
      resellers: resellers.map(PrismaResellerMapper.toDomain),
      total,
    };
  }

  async update(reseller: Reseller): Promise<Reseller> {
    const data = reseller.toObject();
    const updatedReseller = await this.prisma.reseller.update({
      where: {
        id: data.id,
        companyId: data.companyId,
        deletedAt: null,
      },
      data: {
        name: data.name,
        registrationNumber: data.registrationNumber,
        phoneNumber: data.phoneNumber,
        email: data.email,
        updatedAt: data.updatedAt,
        updatedById: data.updatedById,
      },
    });

    return PrismaResellerMapper.toDomain(updatedReseller);
  }

  async delete(reseller: Reseller): Promise<void> {
    const data = reseller.toObject();

    await this.prisma.reseller.update({
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
}
