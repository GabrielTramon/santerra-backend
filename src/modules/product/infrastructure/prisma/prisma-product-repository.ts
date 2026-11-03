import { Prisma, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

import { Product } from "../../domain/entities/product";
import {
  ProductRepository,
  FindProductsParams,
  FindProductsResult,
} from "../../domain/repositories/product-repository";
import { PrismaProductMapper, productInclude } from "./prisma-product-mapper";

@injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(product: Product): Promise<Product> {
    const { groupIds, fileIds, ...data } = product.toObject();
    const [, , , createdProduct] = await this.prisma.$transaction([
      this.prisma.product.create({ data }),
      this.prisma.productGroup.createMany({
        data: groupIds.map((groupId) => ({
          productId: data.id,
          groupId,
          companyId: data.companyId,
        })),
      }),
      this.prisma.fileProduct.createMany({
        data: fileIds.map((fileId) => ({
          productId: data.id,
          fileId,
          companyId: data.companyId,
        })),
      }),
      this.prisma.product.findUniqueOrThrow({
        where: { id: data.id },
        include: productInclude,
      }),
    ]);

    return PrismaProductMapper.toDomain(createdProduct);
  }

  async findById(
    id: string,
    companyId: string,
    includeDeleted = false,
  ): Promise<Product | null> {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        companyId,
        deletedAt: includeDeleted ? undefined : null,
      },
      include: productInclude,
    });

    return product ? PrismaProductMapper.toDomain(product) : null;
  }

  async findManyByIds(ids: string[], companyId: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: ids },
        companyId,
        deletedAt: null,
      },
      include: productInclude,
    });

    return products.map(PrismaProductMapper.toDomain);
  }

  async findMany(params: FindProductsParams): Promise<FindProductsResult> {
    const where: Prisma.ProductWhereInput = {
      companyId: params.companyId,
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
        include: productInclude,
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
    const { groupIds, fileIds, ...data } = product.toObject();
    const [, , , , updatedProduct] = await this.prisma.$transaction([
      this.prisma.productGroup.deleteMany({
        where: {
          productId: data.id,
          companyId: data.companyId,
        },
      }),
      this.prisma.productGroup.createMany({
        data: groupIds.map((groupId) => ({
          productId: data.id,
          groupId,
          companyId: data.companyId,
        })),
      }),
      this.prisma.fileProduct.deleteMany({
        where: {
          productId: data.id,
          companyId: data.companyId,
        },
      }),
      this.prisma.fileProduct.createMany({
        data: fileIds.map((fileId) => ({
          productId: data.id,
          fileId,
          companyId: data.companyId,
        })),
      }),
      this.prisma.product.update({
        where: {
          id: data.id,
          companyId: data.companyId,
          deletedAt: null,
        },
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          costPrice: data.costPrice,
          manufacturerId: data.manufacturerId,
          updatedAt: data.updatedAt,
          updatedById: data.updatedById,
        },
        include: productInclude,
      }),
    ]);

    return PrismaProductMapper.toDomain(updatedProduct);
  }

  async delete(product: Product): Promise<void> {
    const data = product.toObject();

    await this.prisma.product.update({
      where: {
        id: data.id,
        companyId: data.companyId,
        deletedAt: null,
      },
      data: {
        deletedAt: data.deletedAt,
        deletedById: data.deletedById,
      },
    });
  }
}
