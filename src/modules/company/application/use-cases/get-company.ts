import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { ensureUuid } from "../../../../shared/validation/uuid";
import { CompanyProps } from "../../domain/entities/company";
import { CompanyRepository } from "../../domain/repositories/company-repository";

export class GetCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(id: string): Promise<CompanyProps> {
    ensureUuid(id);

    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new ResourceNotFoundError("Empresa");
    }

    return company.toObject();
  }
}
