import { Prisma, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

import { Harvest } from "../../domain/entities/harvest";
import {
  HarvestRepository,
  FindHarvestsParams,
  FindHarvestsResult,
} from "../../domain/repositories/harvest-repository";
import { PrismaHarvestMapper } from "./prisma-harvest-mapper";

@injectable()
export class PrismaHarvestRepository implements HarvestRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(harvest: Harvest): Promise<Harvest> {
    const data = harvest.toObject();
    const createdHarvest = await this.prisma.harvest.create({ data });

    return PrismaHarvestMapper.toDomain(createdHarvest);
  }

  async findById(id: string, includeDeleted = false): Promise<Harvest | null> {
    const harvest = await this.prisma.harvest.findFirst({
      where: {
        id,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return harvest ? PrismaHarvestMapper.toDomain(harvest) : null;
  }

  async findMany(params: FindHarvestsParams): Promise<FindHarvestsResult> {
    const where: Prisma.HarvestWhereInput = {
      deletedAt: params.includeDeleted ? undefined : null,
      OR: params.search
        ? [
            { name: { contains: params.search, mode: "insensitive" } },
          ]
        : undefined,
    };

    const [harvests, total] = await this.prisma.$transaction([
      this.prisma.harvest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.prisma.harvest.count({ where }),
    ]);

    return {
      harvests: harvests.map(PrismaHarvestMapper.toDomain),
      total,
    };
  }

  async update(harvest: Harvest): Promise<Harvest> {
    const data = harvest.toObject();
    const updatedHarvest = await this.prisma.harvest.update({
      where: {
        id: data.id,
        deletedAt: null,
      },
      data: {
        name: data.name,
        updatedAt: data.updatedAt,
        updatedById: data.updatedById,
      },
    });

    return PrismaHarvestMapper.toDomain(updatedHarvest);
  }

  async delete(harvest: Harvest): Promise<void> {
    const data = harvest.toObject();

    await this.prisma.harvest.update({
      where: {
        id: data.id,
        deletedAt: null,
      },
      data: {
        deletedAt: data.deletedAt,
        deletedById: data.deletedById,
      },
    });
  }
}
