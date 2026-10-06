import "dotenv/config";

import { PrismaClient } from "@prisma/client";

import { seedCompanies } from "./companies-seed";
import { seedPersons } from "./persons-seed";
import { seedManufacturers } from "./manufacturers-seed";
import { seedProducts } from "./products-seed";

import { getProtectedEnvironmentReason } from "./environment";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const protectedReason = getProtectedEnvironmentReason();

  if (protectedReason) {
    console.warn(
      `[seed] Ambiente da main (${protectedReason}): seeds de desenvolvimento ignorados.`,
    );
    return;
  }
  await seedCompanies(prisma);
  await seedPersons(prisma);
  await seedManufacturers(prisma);
  await seedProducts(prisma);
}

main()
  .catch((error) => {
    console.error("[seed] Falha ao executar o seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
