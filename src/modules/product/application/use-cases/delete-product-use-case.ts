import { inject, injectable } from "tsyringe";

import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { ensureUuid } from "../../../../shared/validation/uuid";
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from "../../domain/repositories/product-repository";

@injectable()
export class DeleteProductUseCase {
  constructor(
    @inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string): Promise<void> {
    ensureUuid(id);

    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ResourceNotFoundError("Produto");
    }

    product.delete();
    await this.productRepository.delete(product);
  }
}
