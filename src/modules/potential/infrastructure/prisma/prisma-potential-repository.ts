import { Prisma, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

import { Potential } from "../../domain/entities/potential";
import {
  PotentialRepository,
  FindPotentialsParams,
  FindPotentialsResult,
} from "../../domain/repositories/potential-repository";
import { PrismaPotentialMapper } from "./prisma-potential-mapper";

@injectable()
export class PrismaPotentialRepository implements PotentialRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(potential: Potential): Promise<Potential> {
    const data = potential.toObject();
    const createdPotential = await this.prisma.potential.create({ data });

    return PrismaPotentialMapper.toDomain(createdPotential);
  }

  async findById(id: string, includeDeleted = false): Promise<Potential | null> {
    const potential = await this.prisma.potential.findFirst({
      where: {
        id,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return potential ? PrismaPotentialMapper.toDomain(potential) : null;
  }

  async findMany(params: FindPotentialsParams): Promise<FindPotentialsResult> {
    const where: Prisma.PotentialWhereInput = {
      deletedAt: params.includeDeleted ? undefined : null,
      OR: params.search
        ? [
            { name: { contains: params.search, mode: "insensitive" } },
            { description: { contains: params.search, mode: "insensitive" } },
          ]
        : undefined,
    };

    const [potentials, total] = await this.prisma.$transaction([
      this.prisma.potential.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.prisma.potential.count({ where }),
    ]);

    return {
      potentials: potentials.map(PrismaPotentialMapper.toDomain),
      total,
    };
  }

  async update(potential: Potential): Promise<Potential> {
    const data = potential.toObject();
    const updatedPotential = await this.prisma.potential.update({
      where: {
        id: data.id,
        deletedAt: null,
      },
      data: {
        name: data.name,
        numericValue: data.numericValue,
        description: data.description,
        companyId: data.companyId,
        updatedAt: data.updatedAt,
        updatedById: data.updatedById,
      },
    });

    return PrismaPotentialMapper.toDomain(updatedPotential);
  }

  async delete(potential: Potential): Promise<void> {
    const data = potential.toObject();

    await this.prisma.potential.update({
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
