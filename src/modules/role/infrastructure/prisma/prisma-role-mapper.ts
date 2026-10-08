import { Role as PrismaRole } from "@prisma/client";

import { Role } from "../../domain/entities/role";

export class PrismaRoleMapper {
  static toDomain(raw: PrismaRole): Role {
    return Role.reconstitute({
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
