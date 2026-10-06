import { inject, injectable } from "tsyringe";

import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import {
  PERSON_REPOSITORY,
  PersonRepository,
} from "../../domain/repositories/person-repository";

@injectable()
export class DeletePersonUseCase {
  constructor(
    @inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const person = await this.personRepository.findById(id);

    if (!person) {
      throw new ResourceNotFoundError("Pessoa");
    }

    person.delete();
    await this.personRepository.delete(person);
  }
}
