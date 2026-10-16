import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
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

  async execute(
    id: string,
    input: UpdateProductDto,
    context: TenantContext,
  ): Promise<ProductProps> {
    const product = await this.productRepository.findById(id, context.companyId);

    if (!product) {
      throw new ResourceNotFoundError("Produto não encontrado.");
    }

    product.update({ ...input, updatedById: context.userId });
    const updatedProduct = await this.productRepository.update(product);

    return updatedProduct.toObject();
  }
}
