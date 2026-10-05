import { inject, injectable } from "tsyringe";

import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { ProductProps } from "../../domain/entities/product";
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from "../../domain/repositories/product-repository";
import { UpdateProductDto } from "../dtos/update-product-dto";

@injectable()
export class UpdateProductUseCase {
  constructor(
    @inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string, input: UpdateProductDto): Promise<ProductProps> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ResourceNotFoundError("Produto");
    }

    product.update(input);
    const updatedProduct = await this.productRepository.update(product);

    return updatedProduct.toObject();
  }
}
