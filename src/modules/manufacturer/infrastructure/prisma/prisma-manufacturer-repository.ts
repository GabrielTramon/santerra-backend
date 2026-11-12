import { Prisma, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

import { Manufacturer } from "../../domain/entities/manufacturer";
import {
  ManufacturerRepository,
  FindManufacturersParams,
  FindManufacturersResult,
} from "../../domain/repositories/manufacturer-repository";
import { PrismaManufacturerMapper } from "./prisma-manufacturer-mapper";

@injectable()
export class PrismaManufacturerRepository implements ManufacturerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(manufacturer: Manufacturer): Promise<Manufacturer> {
    const data = manufacturer.toObject();
    const createdManufacturer = await this.prisma.manufacturer.create({ data });

    return PrismaManufacturerMapper.toDomain(createdManufacturer);
  }

  async findById(id: string, includeDeleted = false): Promise<Manufacturer | null> {
    const manufacturer = await this.prisma.manufacturer.findFirst({
      where: {
        id,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return manufacturer ? PrismaManufacturerMapper.toDomain(manufacturer) : null;
  }

  async findMany(params: FindManufacturersParams): Promise<FindManufacturersResult> {
    const where: Prisma.ManufacturerWhereInput = {
      deletedAt: params.includeDeleted ? undefined : null,
      OR: params.search
        ? [
            { name: { contains: params.search, mode: "insensitive" } },
            { registrationNumber: { contains: params.search, mode: "insensitive" } },
          ]
        : undefined,
    };

    const [manufacturers, total] = await this.prisma.$transaction([
      this.prisma.manufacturer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.prisma.manufacturer.count({ where }),
    ]);

    return {
      manufacturers: manufacturers.map(PrismaManufacturerMapper.toDomain),
      total,
    };
  }

  async update(manufacturer: Manufacturer): Promise<Manufacturer> {
    const data = manufacturer.toObject();
    const updatedManufacturer = await this.prisma.manufacturer.update({
      where: {
        id: data.id,
        deletedAt: null,
      },
      data: {
        name: data.name,
        registrationNumber: data.registrationNumber,
        phoneNumber: data.phoneNumber,
        email: data.email,
        passwordHash: data.passwordHash,
        updatedAt: data.updatedAt,
        updatedById: data.updatedById,
      },
    });

    return PrismaManufacturerMapper.toDomain(updatedManufacturer);
  }

  async delete(manufacturer: Manufacturer): Promise<void> {
    const data = manufacturer.toObject();

    await this.prisma.manufacturer.update({
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
