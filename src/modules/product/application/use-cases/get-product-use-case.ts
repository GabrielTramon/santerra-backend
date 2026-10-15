import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { ProductProps } from "../../domain/entities/product";
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from "../../domain/repositories/product-repository";

@injectable()
export class GetProductUseCase {
  constructor(
    @inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string, context: TenantContext): Promise<ProductProps> {
    const product = await this.productRepository.findById(id, context.companyId);

    if (!product) {
      throw new ResourceNotFoundError("Produto não encontrado.");
    }

    return product.toObject();
  }
}
