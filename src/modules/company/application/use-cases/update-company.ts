import {
  ResourceNotFoundError,
  ValidationError,
} from "../../../../shared/errors/app-error";
import { ensureOptionalUuid, ensureUuid } from "../../../../shared/validation/uuid";
import { CompanyProps } from "../../domain/entities/company";
import { CompanyRepository } from "../../domain/repositories/company-repository";
import { UpdateCompanyInput } from "../dtos/company-dtos";

export class UpdateCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(input: UpdateCompanyInput): Promise<CompanyProps> {
    ensureUuid(input.id);
    ensureOptionalUuid(input.updatedById, "updatedById");

    if (
      input.name === undefined &&
      input.description === undefined &&
      input.logo === undefined
    ) {
      throw new ValidationError("Informe ao menos um campo para atualizar.");
    }

    const company = await this.companyRepository.findById(input.id);

    if (!company) {
      throw new ResourceNotFoundError("Empresa");
    }

    company.update(input);
    const updatedCompany = await this.companyRepository.save(company);

    return updatedCompany.toObject();
  }
}
