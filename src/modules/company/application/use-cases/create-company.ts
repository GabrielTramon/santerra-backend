import { ensureOptionalUuid } from "../../../../shared/validation/uuid";
import { Company, CompanyProps } from "../../domain/entities/company";
import { CompanyRepository } from "../../domain/repositories/company-repository";
import { CreateCompanyInput } from "../dtos/company-dtos";

export class CreateCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(input: CreateCompanyInput): Promise<CompanyProps> {
    ensureOptionalUuid(input.createdById, "createdById");

    const company = Company.create(input);
    const createdCompany = await this.companyRepository.create(company);

    return createdCompany.toObject();
  }
}
