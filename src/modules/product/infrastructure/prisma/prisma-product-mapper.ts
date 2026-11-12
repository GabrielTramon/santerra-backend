import { Prisma } from "@prisma/client";

import { Product } from "../../domain/entities/product";

export const productInclude = {
  groups: {
    where: { group: { deletedAt: null } },
    select: { groupId: true },
  },
  files: {
    where: { file: { deletedAt: null } },
    select: { fileId: true },
  },
} satisfies Prisma.ProductInclude;

type PrismaProduct = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    return Product.reconstitute({
      id: raw.id,
      name: raw.name,
      description: raw.description,
      price: raw.price?.toNumber() ?? null,
      costPrice: raw.costPrice?.toNumber() ?? null,
      manufacturerId: raw.manufacturerId,
      companyId: raw.companyId,
      groupIds: raw.groups.map((group) => group.groupId),
      fileIds: raw.files.map((file) => file.fileId),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      createdById: raw.createdById,
      updatedById: raw.updatedById,
      deletedById: raw.deletedById,
    });
  }
}
