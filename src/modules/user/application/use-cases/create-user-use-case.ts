import { inject, injectable } from "tsyringe";

import {
  PASSWORD_HASHER,
  PasswordHasher,
} from "../../../../shared/application/cryptography/password-hasher";
import {
  ConflictError,
  ResourceNotFoundError,
} from "../../../../shared/errors/app-error";
import { PERSON_REPOSITORY, PersonRepository } from "../../../person";
import { PublicUserProps, User } from "../../domain/entities/user";
import {
  USER_REPOSITORY,
  UserRepository,
} from "../../domain/repositories/user-repository";
import { CreateUserDto } from "../dtos/create-user-dto";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepository,
    @inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: CreateUserDto): Promise<PublicUserProps> {
    const person = await this.personRepository.findById(input.personId);

    if (!person) {
      throw new ResourceNotFoundError("Pessoa não encontrada.");
    }

    if (await this.userRepository.findByPersonId(input.personId)) {
      throw new ConflictError("Esta pessoa já possui um usuário.");
    }

    const email = User.normalizeEmail(input.email);

    if (await this.userRepository.findByEmail(email)) {
      throw new ConflictError("Já existe um usuário com este e-mail.");
    }

    const user = User.create({
      email,
      personId: input.personId,
      passwordHash: await this.passwordHasher.hash(input.password),
      active: input.active,
    });
    const createdUser = await this.userRepository.create(user);

    return createdUser.toPublicObject();
  }
}
