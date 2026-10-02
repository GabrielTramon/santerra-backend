import { inject, injectable } from "tsyringe";

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

  async execute(input: CreateCompanyDto): Promise<CompanyProps> {
    const company = Company.create(input);
    const createdCompany = await this.companyRepository.create(company);

    return createdCompany.toObject();
  }
}
