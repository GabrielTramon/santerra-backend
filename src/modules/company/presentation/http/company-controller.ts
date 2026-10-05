import { RequestHandler } from "express";
import { injectable } from "tsyringe";

import { idParamSchema, listQuerySchema } from "../../../../shared/http/request-schemas";
import { CreateCompanyUseCase } from "../../application/use-cases/create-company-use-case";
import { DeleteCompanyUseCase } from "../../application/use-cases/delete-company-use-case";
import { GetCompanyUseCase } from "../../application/use-cases/get-company-use-case";
import { ListCompaniesUseCase } from "../../application/use-cases/list-companies-use-case";
import { UpdateCompanyUseCase } from "../../application/use-cases/update-company-use-case";
import { createCompanySchema, updateCompanySchema } from "./company-schemas";

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
      createCompanySchema.parse(request.body),
    );

    response.status(201).json(company);
  };

  list: RequestHandler = async (request, response) => {
    const result = await this.listCompaniesUseCase.execute(
      listQuerySchema.parse(request.query),
    );

    response.status(200).json(result);
  };

  getById: RequestHandler = async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    const company = await this.getCompanyUseCase.execute(id);

    response.status(200).json(company);
  };

  update: RequestHandler = async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    const company = await this.updateCompanyUseCase.execute(
      id,
      updateCompanySchema.parse(request.body),
    );

    response.status(200).json(company);
  };

  delete: RequestHandler = async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    await this.deleteCompanyUseCase.execute(id);

    response.status(204).send();
  };
}
