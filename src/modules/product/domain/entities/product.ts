import { randomUUID } from "node:crypto";

import { DomainError } from "../../../../shared/domain/errors/domain-error";

export interface ProductProps {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  costPrice: number | null;
  manufacturerId: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  createdById: string | null;
  updatedById: string | null;
  deletedById: string | null;
}

interface CreateProductProps {
  name: string;
  description?: string | null;
  price?: number | null;
  costPrice?: number | null;
  manufacturerId: string;
  companyId: string;
  createdById?: string | null;
}

export interface UpdateProductProps {
  name?: string;
  description?: string | null;
  price?: number | null;
  costPrice?: number | null;
  manufacturerId?: string;
  companyId?: string;
  updatedById?: string | null;
}

export class Product {
  private constructor(private readonly props: ProductProps) {}

  static create(
    input: CreateProductProps,
    id = randomUUID(),
    createdAt = new Date(),
  ): Product {
    const name = Product.normalizeName(input.name);
    const manufacturerId = Product.normalizeManufacturerId(input.manufacturerId);
    const companyId = Product.normalizeCompanyId(input.companyId);

    return new Product({
      id,
      name,
      description: input.description ?? null,
      price: input.price ?? null,
      costPrice: input.costPrice ?? null,
      manufacturerId,
      companyId,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
      createdById: input.createdById ?? null,
      updatedById: null,
      deletedById: null,
    });
  }

  static reconstitute(props: ProductProps): Product {
    return new Product({ ...props });
  }

  update(input: UpdateProductProps, updatedAt = new Date()): void {
    if (input.name !== undefined) {
      this.props.name = Product.normalizeName(input.name);
    }

    if (input.description !== undefined) {
      this.props.description = input.description;
    }
    
    if (input.price !== undefined) {
      this.props.price = input.price;
    }

    if (input.costPrice !== undefined) {
      this.props.costPrice = input.costPrice;
    }

    if (input.manufacturerId !== undefined) {
      this.props.manufacturerId = Product.normalizeManufacturerId(input.manufacturerId);
    }

    if (input.companyId !== undefined) {
      this.props.companyId = Product.normalizeCompanyId(input.companyId);
    }

    this.props.updatedById = input.updatedById ?? null;
    this.props.updatedAt = updatedAt;
  }

  delete(deletedById: string | null = null, deletedAt = new Date()): void {
    this.props.deletedAt = deletedAt;
    this.props.deletedById = deletedById;
  }

  toObject(): ProductProps {
    return { ...this.props };
  }

  private static normalizeName(name: string): string {
    if (typeof name !== "string" || name.trim().length === 0) {
      throw new DomainError("O nome do produto é obrigatório.");
    }

    return name.trim();
  }

  private static normalizeManufacturerId(manufacturerId?: string): string {
    if (typeof manufacturerId !== "string" || manufacturerId.trim().length === 0) {
      throw new DomainError("O ID do fabricante é obrigatório.");
    }

    return manufacturerId.trim();
  }

  private static normalizeCompanyId(companyId?: string): string {
    if (typeof companyId !== "string" || companyId.trim().length === 0) {
      throw new DomainError("O ID da empresa é obrigatório.");
    }

    return companyId.trim();
  }

}
