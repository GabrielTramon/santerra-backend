import "dotenv/config";

import { PrismaClient } from "@prisma/client";

import { seedCompanies } from "./companies-seed";
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
}

main()
  .catch((error) => {
    console.error("[seed] Falha ao executar o seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
