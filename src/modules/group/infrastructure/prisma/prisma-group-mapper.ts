import { Group as PrismaGroup } from "@prisma/client";

import { Group } from "../../domain/entities/group";

export class PrismaGroupMapper {
  static toDomain(raw: PrismaGroup): Group {
    return Group.reconstitute({
      id: raw.id,
      name: raw.name,
      description: raw.description,
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
