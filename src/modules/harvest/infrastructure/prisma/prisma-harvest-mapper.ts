import { Harvest as PrismaHarvest } from "@prisma/client";

import { Harvest } from "../../domain/entities/harvest";

export class PrismaHarvestMapper {
  static toDomain(raw: PrismaHarvest): Harvest {
    return Harvest.reconstitute({
      id: raw.id,
      name: raw.name,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      createdById: raw.createdById,
      updatedById: raw.updatedById,
      deletedById: raw.deletedById,
    });
  }
}
