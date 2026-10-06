import { inject, injectable } from "tsyringe";

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

  async execute(id: string): Promise<PersonProps> {
    const person = await this.personRepository.findById(id);

    if (!person) {
      throw new ResourceNotFoundError("Pessoa");
    }

    return person.toObject();
  }
}
