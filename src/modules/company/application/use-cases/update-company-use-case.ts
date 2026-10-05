import { inject, injectable } from "tsyringe";

import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { CompanyProps } from "../../domain/entities/company";
import {
  COMPANY_REPOSITORY,
  CompanyRepository,
} from "../../domain/repositories/company-repository";
import { UpdateCompanyDto } from "../dtos/update-company-dto";

@injectable()
export class UpdateCompanyUseCase {
  constructor(
    @inject(COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(id: string, input: UpdateCompanyDto): Promise<CompanyProps> {
    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new ResourceNotFoundError("Empresa");
    }

    company.update(input);
    const updatedCompany = await this.companyRepository.update(company);

    return updatedCompany.toObject();
  }
}
