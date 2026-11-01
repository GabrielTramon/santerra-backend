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
import {
  PASSWORD_RESET_REPOSITORY,
  PasswordResetRepository,
} from "./domain/repositories/password-reset-repository";
import { PrismaAuthRepository } from "./infrastructure/prisma/prisma-auth-repository";
import { PrismaPasswordResetRepository } from "./infrastructure/prisma/prisma-password-reset-repository";

container.registerSingleton<AuthRepository>(AUTH_REPOSITORY, PrismaAuthRepository);

container.registerSingleton<PasswordResetRepository>(
  PASSWORD_RESET_REPOSITORY,
  PrismaPasswordResetRepository,
);

container.registerSingleton<Authenticator>(AUTHENTICATOR, AuthenticateUseCase);
