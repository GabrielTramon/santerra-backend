import { PrismaClient } from "@prisma/client";
import { container } from "tsyringe";

import { prisma } from "./infrastructure/database/prisma-client";

container.registerInstance(PrismaClient, prisma);
