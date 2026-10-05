import { Prisma, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

import { Product } from "../../domain/entities/product";
import {
  ProductRepository,
  FindProductsParams,
  FindProductsResult,
} from "../../domain/repositories/product-repository";
import { PrismaProductMapper } from "./prisma-product-mapper";

@injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(product: Product): Promise<Product> {
    const data = product.toObject();
    const createdProduct = await this.prisma.product.create({ data });

    return PrismaProductMapper.toDomain(createdProduct);
  }

  async findById(id: string, includeDeleted = false): Promise<Product | null> {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return product ? PrismaProductMapper.toDomain(product) : null;
  }

  async findMany(params: FindProductsParams): Promise<FindProductsResult> {
    const where: Prisma.ProductWhereInput = {
      deletedAt: params.includeDeleted ? undefined : null,
      OR: params.search
        ? [
            { name: { contains: params.search, mode: "insensitive" } },
            { description: { contains: params.search, mode: "insensitive" } },
          ]
        : undefined,
    };

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map(PrismaProductMapper.toDomain),
      total,
    };
  }

  async update(product: Product): Promise<Product> {
    const data = product.toObject();
    const updatedProduct = await this.prisma.product.update({
      where: {
        id: data.id,
        deletedAt: null,
      },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        costPrice: data.costPrice,
        manufacturerId: data.manufacturerId,
        companyId: data.companyId,
        updatedAt: data.updatedAt,
        updatedById: data.updatedById,
      },
    });

    return PrismaProductMapper.toDomain(updatedProduct);
  }

  async delete(product: Product): Promise<void> {
    const data = product.toObject();

    await this.prisma.product.update({
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
