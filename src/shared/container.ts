import { PrismaClient } from "@prisma/client";
import { container } from "tsyringe";

import {
  PASSWORD_HASHER,
  PasswordHasher,
} from "./application/cryptography/password-hasher";
import { Argon2PasswordHasher } from "./infrastructure/cryptography/argon2-password-hasher";
import { prisma } from "./infrastructure/database/prisma-client";

container.registerInstance(PrismaClient, prisma);

container.registerSingleton<PasswordHasher>(
  PASSWORD_HASHER,
  Argon2PasswordHasher,
);
