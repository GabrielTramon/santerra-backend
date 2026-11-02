import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { Product, ProductProps } from "../../domain/entities/product";
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from "../../domain/repositories/product-repository";
import {
  PRODUCT_GROUP_REPOSITORY,
  ProductGroupRepository
} from "../../domain/repositories/productGroup-repository";
import { CreateProductDto } from "../dtos/create-product-dto";

@injectable()
export class CreateProductUseCase {
  constructor(
    @inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,

    @inject(PRODUCT_GROUP_REPOSITORY)
    private readonly productGroupRepository: ProductGroupRepository,
  ) { }

  async execute(
    input: CreateProductDto,
    context: TenantContext,
  ): Promise<ProductProps> {
    const { groupIds, ...productInput } = input;

    const product = Product.create({
      ...productInput,
      companyId: context.companyId,
      createdById: context.userId,
    });
    const createdProduct = await this.productRepository.create(product);

    if (groupIds?.length) {
      await this.productGroupRepository.createMany(
        groupIds.map((groupId) => ({
          productId: createdProduct.toObject().id,
          groupId,
          companyId: context.companyId,
        })),
      );
    }

    return createdProduct.toObject();
  }
}
