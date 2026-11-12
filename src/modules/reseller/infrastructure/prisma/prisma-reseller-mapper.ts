import { Reseller as PrismaReseller } from "@prisma/client";

import { Reseller } from "../../domain/entities/reseller";

export class PrismaResellerMapper {
  static toDomain(raw: PrismaReseller): Reseller {
    return Reseller.reconstitute({
      id: raw.id,
      name: raw.name,
      registrationNumber: raw.registrationNumber,
      phoneNumber: raw.phoneNumber,
      email: raw.email,
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
