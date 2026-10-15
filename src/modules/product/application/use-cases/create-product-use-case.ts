import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { Product, ProductProps } from "../../domain/entities/product";
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from "../../domain/repositories/product-repository";
import { CreateProductDto } from "../dtos/create-product-dto";

@injectable()
export class CreateProductUseCase {
  constructor(
    @inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    input: CreateProductDto,
    context: TenantContext,
  ): Promise<ProductProps> {
    const product = Product.create({
      ...input,
      companyId: context.companyId,
      createdById: context.userId,
    });
    const createdProduct = await this.productRepository.create(product);

    return createdProduct.toObject();
  }
}
