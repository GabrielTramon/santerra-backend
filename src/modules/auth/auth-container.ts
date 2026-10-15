import { container } from "tsyringe";

import {
  AUTHENTICATOR,
  Authenticator,
} from "../../shared/application/auth/authenticator";
import { AuthenticateUseCase } from "./application/use-cases/authenticate-use-case";
import {
  AUTH_REPOSITORY,
  AuthRepository,
} from "./domain/repositories/auth-repository";
import { PrismaAuthRepository } from "./infrastructure/prisma/prisma-auth-repository";

container.registerSingleton<AuthRepository>(AUTH_REPOSITORY, PrismaAuthRepository);

container.registerSingleton<Authenticator>(AUTHENTICATOR, AuthenticateUseCase);
