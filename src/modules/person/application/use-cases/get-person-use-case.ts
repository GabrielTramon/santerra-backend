import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { PersonProps } from "../../domain/entities/person";
import {
  PERSON_REPOSITORY,
  PersonRepository,
} from "../../domain/repositories/person-repository";

@injectable()
export class GetPersonUseCase {
  constructor(
    @inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(id: string, context: TenantContext): Promise<PersonProps> {
    const person = await this.personRepository.findById(id, context.companyId);

    if (!person) {
      throw new ResourceNotFoundError("Pessoa não encontrada.");
    }

    return person.toObject();
  }
}
