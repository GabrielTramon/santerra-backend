import { Request } from "express";

import { ValidationError } from "../../../../shared/errors/app-error";
import {
  CreateCompanyInput,
  DeleteCompanyInput,
  ListCompaniesInput,
  UpdateCompanyInput,
} from "../../application/dtos/company-dtos";

type RequestBody = Record<string, unknown>;

function getBody(request: Request): RequestBody {
  if (!request.body || typeof request.body !== "object" || Array.isArray(request.body)) {
    throw new ValidationError("O corpo da requisição deve ser um objeto JSON.");
  }

  return request.body as RequestBody;
}

function getOptionalBody(request: Request): RequestBody | undefined {
  if (request.body === undefined) {
    return undefined;
  }

  return getBody(request);
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

function queryString(request: Request, field: string): string | undefined {
  const value = request.query[field];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ValidationError(`O parâmetro '${field}' deve possuir apenas um valor.`);
  }

  return value;
}

function optionalPositiveInteger(value: string | undefined, field: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!/^\d+$/.test(value)) {
    throw new ValidationError(`O parâmetro '${field}' deve ser um número inteiro.`);
  }

  return Number(value);
}

export function parseCreateCompanyRequest(request: Request): CreateCompanyInput {
  const body = getBody(request);

  return {
    name: requiredString(body, "name"),
    description: optionalNullableString(body, "description"),
    logo: optionalNullableString(body, "logo"),
    createdById: optionalNullableString(body, "createdById"),
  };
}

export function parseUpdateCompanyRequest(request: Request): UpdateCompanyInput {
  const body = getBody(request);

  return {
    id: parseCompanyId(request),
    name:
      body.name === undefined ? undefined : requiredString(body, "name"),
    description: optionalNullableString(body, "description"),
    logo: optionalNullableString(body, "logo"),
    updatedById: optionalNullableString(body, "updatedById"),
  };
}

export function parseDeleteCompanyRequest(request: Request): DeleteCompanyInput {
  const body = getOptionalBody(request);

  return {
    id: parseCompanyId(request),
    deletedById: body
      ? optionalNullableString(body, "deletedById")
      : undefined,
  };
}

export function parseListCompaniesRequest(request: Request): ListCompaniesInput {
  const includeDeleted = queryString(request, "includeDeleted");

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
    page: optionalPositiveInteger(queryString(request, "page"), "page"),
    limit: optionalPositiveInteger(queryString(request, "limit"), "limit"),
    search: queryString(request, "search"),
    includeDeleted:
      includeDeleted === undefined ? undefined : includeDeleted === "true",
  };
}
