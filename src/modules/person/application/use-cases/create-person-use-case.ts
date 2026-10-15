import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { ConflictError } from "../../../../shared/errors/app-error";
import { Person, PersonProps } from "../../domain/entities/person";
import {
  PERSON_REPOSITORY,
  PersonRepository,
} from "../../domain/repositories/person-repository";
import { CreatePersonDto } from "../dtos/create-person-dto";

@injectable()
export class CreatePersonUseCase {
  constructor(
    @inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(
    input: CreatePersonDto,
    context: TenantContext,
  ): Promise<PersonProps> {
    if (
      input.nationalId &&
      (await this.personRepository.findByNationalId(
        input.nationalId,
        context.companyId,
      ))
    ) {
      throw new ConflictError("Já existe uma pessoa com este documento.");
    }

    const person = Person.create({
      ...input,
      companyId: context.companyId,
      createdById: context.userId,
    });
    const createdPerson = await this.personRepository.create(person);

    return createdPerson.toObject();
  }
}
