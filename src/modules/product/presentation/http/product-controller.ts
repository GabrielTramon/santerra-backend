import { RequestHandler } from "express";
import { injectable } from "tsyringe";

import { CreateProductUseCase } from "../../application/use-cases/create-product-use-case";
import { DeleteProductUseCase } from "../../application/use-cases/delete-product-use-case";
import { GetProductUseCase } from "../../application/use-cases/get-product-use-case";
import { ListProductsUseCase } from "../../application/use-cases/list-products-use-case";
import { UpdateProductUseCase } from "../../application/use-cases/update-product-use-case";
import {
  parseCreateProductRequest,
  parseProductId,
  parseListProductsRequest,
  parseUpdateProductRequest,
} from "./product-request-parser";

@injectable()
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  create: RequestHandler = async (request, response) => {
    const product = await this.createProductUseCase.execute(
      parseCreateProductRequest(request),
    );

    response.status(201).json(product);
  };

  list: RequestHandler = async (request, response) => {
    const result = await this.listProductsUseCase.execute(
      parseListProductsRequest(request),
    );

    response.status(200).json(result);
  };

  getById: RequestHandler = async (request, response) => {
    const product = await this.getProductUseCase.execute(parseProductId(request));

    response.status(200).json(product);
  };

  update: RequestHandler = async (request, response) => {
    const product = await this.updateProductUseCase.execute(
      parseProductId(request),
      parseUpdateProductRequest(request),
    );

    response.status(200).json(product);
  };

  delete: RequestHandler = async (request, response) => {
    await this.deleteProductUseCase.execute(parseProductId(request));

    response.status(204).send();
  };
}
