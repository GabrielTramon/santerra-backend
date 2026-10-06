import { Person as PrismaPerson } from "@prisma/client";

import { Person } from "../../domain/entities/person";

export class PrismaPersonMapper {
  static toDomain(raw: PrismaPerson): Person {
    return Person.reconstitute({
      id: raw.id,
      name: raw.name,
      nationalId: raw.nationalId,
      phoneNumber: raw.phoneNumber,
      email: raw.email,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      createdById: raw.createdById,
      updatedById: raw.updatedById,
      deletedById: raw.deletedById,
    });
  }
}
