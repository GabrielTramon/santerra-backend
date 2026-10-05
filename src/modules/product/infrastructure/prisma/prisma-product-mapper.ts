import { Product as PrismaProduct } from "@prisma/client";

import { Product } from "../../domain/entities/product";

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    return Product.reconstitute({
      id: raw.id,
      name: raw.name,
      description: raw.description,
      price: raw.price,
      costPrice: raw.costPrice,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      createdById: raw.createdById,
      updatedById: raw.updatedById,
      deletedById: raw.deletedById,
    });
  }
}
