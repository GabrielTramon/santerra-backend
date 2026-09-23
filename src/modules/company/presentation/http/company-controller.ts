import { RequestHandler } from "express";

import { CreateCompanyUseCase } from "../../application/use-cases/create-company";
import { DeleteCompanyUseCase } from "../../application/use-cases/delete-company";
import { GetCompanyUseCase } from "../../application/use-cases/get-company";
import { ListCompaniesUseCase } from "../../application/use-cases/list-companies";
import { UpdateCompanyUseCase } from "../../application/use-cases/update-company";
import {
  parseCreateCompanyRequest,
  parseCompanyId,
  parseDeleteCompanyRequest,
  parseListCompaniesRequest,
  parseUpdateCompanyRequest,
} from "./company-request-parser";

export class CompanyController {
  constructor(
    private readonly createCompany: CreateCompanyUseCase,
    private readonly listCompanies: ListCompaniesUseCase,
    private readonly getCompany: GetCompanyUseCase,
    private readonly updateCompany: UpdateCompanyUseCase,
    private readonly deleteCompany: DeleteCompanyUseCase,
  ) {}

  create: RequestHandler = async (request, response) => {
    const company = await this.createCompany.execute(
      parseCreateCompanyRequest(request),
    );

    response.status(201).json(company);
  };

  list: RequestHandler = async (request, response) => {
    const result = await this.listCompanies.execute(
      parseListCompaniesRequest(request),
    );

    response.status(200).json(result);
  };

  getById: RequestHandler = async (request, response) => {
    const company = await this.getCompany.execute(parseCompanyId(request));

    response.status(200).json(company);
  };

  update: RequestHandler = async (request, response) => {
    const company = await this.updateCompany.execute(
      parseUpdateCompanyRequest(request),
    );

    response.status(200).json(company);
  };

  delete: RequestHandler = async (request, response) => {
    await this.deleteCompany.execute(parseDeleteCompanyRequest(request));

    response.status(204).send();
  };
}
