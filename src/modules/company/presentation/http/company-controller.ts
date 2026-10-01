import { RequestHandler } from "express";
import { injectable } from "tsyringe";

import { CreateCompanyUseCase } from "../../application/use-cases/create-company-use-case";
import { DeleteCompanyUseCase } from "../../application/use-cases/delete-company-use-case";
import { GetCompanyUseCase } from "../../application/use-cases/get-company-use-case";
import { ListCompaniesUseCase } from "../../application/use-cases/list-companies-use-case";
import { UpdateCompanyUseCase } from "../../application/use-cases/update-company-use-case";
import {
  parseCreateCompanyRequest,
  parseCompanyId,
  parseListCompaniesRequest,
  parseUpdateCompanyRequest,
} from "./company-request-parser";

@injectable()
export class CompanyController {
  constructor(
    private readonly createCompanyUseCase: CreateCompanyUseCase,
    private readonly listCompaniesUseCase: ListCompaniesUseCase,
    private readonly getCompanyUseCase: GetCompanyUseCase,
    private readonly updateCompanyUseCase: UpdateCompanyUseCase,
    private readonly deleteCompanyUseCase: DeleteCompanyUseCase,
  ) {}

  create: RequestHandler = async (request, response) => {
    const company = await this.createCompanyUseCase.execute(
      parseCreateCompanyRequest(request),
    );

    response.status(201).json(company);
  };

  list: RequestHandler = async (request, response) => {
    const result = await this.listCompaniesUseCase.execute(
      parseListCompaniesRequest(request),
    );

    response.status(200).json(result);
  };

  getById: RequestHandler = async (request, response) => {
    const company = await this.getCompanyUseCase.execute(parseCompanyId(request));

    response.status(200).json(company);
  };

  update: RequestHandler = async (request, response) => {
    const company = await this.updateCompanyUseCase.execute(
      parseCompanyId(request),
      parseUpdateCompanyRequest(request),
    );

    response.status(200).json(company);
  };

  delete: RequestHandler = async (request, response) => {
    await this.deleteCompanyUseCase.execute(parseCompanyId(request));

    response.status(204).send();
  };
}
