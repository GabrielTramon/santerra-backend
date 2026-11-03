import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { FILE_REPOSITORY, FileRepository } from "../../../file";
import { GROUP_REPOSITORY, GroupRepository } from "../../../group";
import { MANUFACTURER_REPOSITORY, ManufacturerRepository } from "../../../manufacturer";
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
    @inject(MANUFACTURER_REPOSITORY)
    private readonly manufacturerRepository: ManufacturerRepository,
    @inject(GROUP_REPOSITORY)
    private readonly groupRepository: GroupRepository,
    @inject(FILE_REPOSITORY)
    private readonly fileRepository: FileRepository,
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

    if (
      input.manufacturerId !== undefined &&
      !(await this.manufacturerRepository.findById(product.manufacturerId))
    ) {
      throw new ResourceNotFoundError("Fabricante não encontrado.");
    }

    if (input.groupIds !== undefined) {
      const groups = await this.groupRepository.findManyByIds(
        product.groupIds,
        context.companyId,
      );

      if (groups.length !== product.groupIds.length) {
        throw new ResourceNotFoundError("Grupo não encontrado.");
      }
    }

    if (input.fileIds !== undefined) {
      const files = await this.fileRepository.findManyByIds(product.fileIds, context.companyId);

      if (files.length !== product.fileIds.length) {
        throw new ResourceNotFoundError("Arquivo não encontrado.");
      }
    }

    const updatedProduct = await this.productRepository.update(product);

    return updatedProduct.toObject();
  }
}
