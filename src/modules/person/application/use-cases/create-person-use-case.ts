import { inject, injectable } from "tsyringe";

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

  async execute(input: CreatePersonDto): Promise<PersonProps> {
    const person = Person.create(input);
    const createdPerson = await this.personRepository.create(person);

    return createdPerson.toObject();
  }
}
