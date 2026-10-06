import { inject, injectable } from "tsyringe";

import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { PersonProps } from "../../domain/entities/person";
import {
  PERSON_REPOSITORY,
  PersonRepository,
} from "../../domain/repositories/person-repository";
import { UpdatePersonDto } from "../dtos/update-person-dto";

@injectable()
export class UpdatePersonUseCase {
  constructor(
    @inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(id: string, input: UpdatePersonDto): Promise<PersonProps> {
    const person = await this.personRepository.findById(id);

    if (!person) {
      throw new ResourceNotFoundError("Pessoa");
    }

    person.update(input);
    const updatedPerson = await this.personRepository.update(person);

    return updatedPerson.toObject();
  }
}
