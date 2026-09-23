import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { ensureOptionalUuid, ensureUuid } from "../../../../shared/validation/uuid";
import { CompanyRepository } from "../../domain/repositories/company-repository";
import { DeleteCompanyInput } from "../dtos/company-dtos";

export class DeleteCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(input: DeleteCompanyInput): Promise<void> {
    ensureUuid(input.id);
    ensureOptionalUuid(input.deletedById, "deletedById");

    const company = await this.companyRepository.findById(input.id);

    if (!company) {
      throw new ResourceNotFoundError("Empresa");
    }

    company.delete(input.deletedById);
    await this.companyRepository.save(company);
  }
}
