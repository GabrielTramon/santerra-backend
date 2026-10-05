import { inject, injectable } from "tsyringe";

import {
  ResourceNotFoundError,
  ValidationError,
} from "../../../../shared/errors/app-error";
import { ensureUuid } from "../../../../shared/validation/uuid";
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
    ensureUuid(id);

    if (
      input.name === undefined &&
      input.description === undefined &&
      input.price === undefined &&
      input.costPrice === undefined
    ) {
      throw new ValidationError("Informe ao menos um campo para atualizar.");
    }

    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ResourceNotFoundError("Produto");
    }

    product.update(input);
    const updatedProduct = await this.productRepository.update(product);

    return updatedProduct.toObject();
  }
}
