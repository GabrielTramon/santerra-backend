import { inject, injectable } from "tsyringe";

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

  async execute(input: CreateProductDto): Promise<ProductProps> {
    const product = Product.create(input);
    const createdProduct = await this.productRepository.create(product);

    return createdProduct.toObject();
  }
}
