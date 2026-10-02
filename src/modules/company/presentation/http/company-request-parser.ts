import { Request } from "express";

import { ValidationError } from "../../../../shared/errors/app-error";
import { CreateCompanyDto } from "../../application/dtos/create-company-dto";
import { ListCompaniesDto } from "../../application/dtos/list-companies-dto";
import { UpdateCompanyDto } from "../../application/dtos/update-company-dto";

type RequestBody = Record<string, unknown>;

function getBody(request: Request): RequestBody {
  if (!request.body || typeof request.body !== "object" || Array.isArray(request.body)) {
    throw new ValidationError("O corpo da requisição deve ser um objeto JSON.");
  }

  return request.body as RequestBody;
}

export function parseCompanyId(request: Request): string {
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

export function parseCreateCompanyRequest(request: Request): CreateCompanyDto {
  const body = getBody(request);

  return {
    name: requiredString(body, "name"),
    description: optionalNullableString(body, "description"),
    logo: optionalNullableString(body, "logo"),
  };
}

export function parseUpdateCompanyRequest(request: Request): UpdateCompanyDto {
  const body = getBody(request);

  return {
    name:
      body.name === undefined ? undefined : requiredString(body, "name"),
    description: optionalNullableString(body, "description"),
    logo: optionalNullableString(body, "logo"),
  };
}

export function parseListCompaniesRequest(request: Request): ListCompaniesDto {
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
