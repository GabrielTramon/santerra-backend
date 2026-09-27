import { Router } from "express";

import { prisma } from "../../shared/infra/database/prisma-client";
import { CreateCompanyUseCase } from "./application/use-cases/create-company";
import { DeleteCompanyUseCase } from "./application/use-cases/delete-company";
import { GetCompanyUseCase } from "./application/use-cases/get-company";
import { ListCompaniesUseCase } from "./application/use-cases/list-companies";
import { UpdateCompanyUseCase } from "./application/use-cases/update-company";
import { PrismaCompanyRepository } from "./infrastructure/prisma/prisma-company-repository";
import { CompanyController } from "./presentation/http/company-controller";
import { createCompanyRouter } from "./presentation/http/company-routes";

export function makeCompanyModule(): Router {
  const companyRepository = new PrismaCompanyRepository(prisma);
  const controller = new CompanyController(
    new CreateCompanyUseCase(companyRepository),
    new ListCompaniesUseCase(companyRepository),
    new GetCompanyUseCase(companyRepository),
    new UpdateCompanyUseCase(companyRepository),
    new DeleteCompanyUseCase(companyRepository),
  );

  return createCompanyRouter(controller);
}
