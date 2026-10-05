import { Request } from "express";

import { ValidationError } from "../../../../shared/errors/app-error";
import { CreateProductDto } from "../../application/dtos/create-product-dto";
import { ListProductsDto } from "../../application/dtos/list-products-dto";
import { UpdateProductDto } from "../../application/dtos/update-product-dto";

type RequestBody = Record<string, unknown>;

function getBody(request: Request): RequestBody {
  if (!request.body || typeof request.body !== "object" || Array.isArray(request.body)) {
    throw new ValidationError("O corpo da requisição deve ser um objeto JSON.");
  }

  return request.body as RequestBody;
}

export function parseProductId(request: Request): string {
  const id = request.params.id;

  if (typeof id !== "string") {
    throw new ValidationError("O parâmetro 'id' deve possuir apenas um valor.");
  }

  return id;
}

function requiredString(body: RequestBody, field: string): string {
  const value = body[field];

  if (typeof value !== "string") {
    throw new ValidationError(`O campo '${field}' deve ser uma string.`);
  }

  return value;
}

function optionalNullableString(
  body: RequestBody,
  field: string,
): string | null | undefined {
  const value = body[field];

  if (value === undefined || value === null || typeof value === "string") {
    return value;
  }

  throw new ValidationError(`O campo '${field}' deve ser uma string ou nulo.`);
}

function queryParam(request: Request, field: string): string | undefined {
  const value = request.query[field];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ValidationError(`O parâmetro '${field}' deve possuir apenas um valor.`);
  }

  return value;
}

function optionalInteger(value: string | undefined, field: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!/^-?\d+$/.test(value)) {
    throw new ValidationError(`O parâmetro '${field}' deve ser um número inteiro.`);
  }

  return Number(value);
}

export function parseCreateProductRequest(request: Request): CreateProductDto {
  const body = getBody(request);

  return {
    name: requiredString(body, "name"),
    description: optionalNullableString(body, "description"),
    price: optionalInteger(queryParam(request, "price"), "price"),
    costPrice: optionalInteger(queryParam(request, "costPrice"), "costPrice"),
    manufacturerId: requiredString(body, "manufacturerId"),
    companyId: requiredString(body, "companyId"),
  };
}

export function parseUpdateProductRequest(request: Request): UpdateProductDto {
  const body = getBody(request);

  return {
    name:
      body.name === undefined ? undefined : requiredString(body, "name"),
    description: optionalNullableString(body, "description"),
    price: optionalInteger(queryParam(request, "price"), "price"),
    costPrice: optionalInteger(queryParam(request, "costPrice"), "costPrice"),
    manufacturerId: body.manufacturerId === undefined ? undefined : requiredString(body, "manufacturerId"),
    companyId: body.companyId === undefined ? undefined : requiredString(body, "companyId"),
  };
}

export function parseListProductsRequest(request: Request): ListProductsDto {
  const includeDeleted = queryParam(request, "includeDeleted");

  if (
    includeDeleted !== undefined &&
    includeDeleted !== "true" &&
    includeDeleted !== "false"
  ) {
    throw new ValidationError(
      "O parâmetro 'includeDeleted' deve ser 'true' ou 'false'.",
    );
  }

  return {
    page: optionalInteger(queryParam(request, "page"), "page"),
    limit: optionalInteger(queryParam(request, "limit"), "limit"),
    search: queryParam(request, "search"),
    includeDeleted:
      includeDeleted === undefined ? undefined : includeDeleted === "true",
  };
}
