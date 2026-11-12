import { inject, injectable } from "tsyringe";

import { AuthContext } from "../../../../shared/application/auth/auth-context";
import { Company, CompanyProps } from "../../domain/entities/company";
import {
  COMPANY_REPOSITORY,
  CompanyRepository,
} from "../../domain/repositories/company-repository";
import { CreateCompanyDto } from "../dtos/create-company-dto";

@injectable()
export class CreateCompanyUseCase {
  constructor(
    @inject(COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(
    input: CreateCompanyDto,
    context: AuthContext,
  ): Promise<CompanyProps> {
    const company = Company.create({ ...input, createdById: context.userId });
    const createdCompany = await this.companyRepository.create(company);

    return createdCompany.toObject();
  }
}
