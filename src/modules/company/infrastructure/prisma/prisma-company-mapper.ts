import { Company as PrismaCompany } from "@prisma/client";

import { Company } from "../../domain/entities/company";

export class PrismaCompanyMapper {
  static toDomain(raw: PrismaCompany): Company {
    return Company.restore({
      id: raw.id,
      name: raw.name,
      description: raw.description,
      logo: raw.logo,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      createdById: raw.createdById,
      updatedById: raw.updatedById,
      deletedById: raw.deletedById,
    });
  }
}
