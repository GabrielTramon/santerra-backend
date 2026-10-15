import { Prisma, PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const DEFAULT_PASSWORD = "Senha@123";

const users: Omit<Prisma.UserCreateManyInput, "passwordHash">[] = [
  {
    id: "00000000-0000-4000-a000-000000000001",
    email: "sipriano@email.com",
    personId: "00000000-0000-4000-a000-000000000001",
  },
  {
    id: "00000000-0000-4000-a000-000000000002",
    email: "joao@cesar.com",
    personId: "00000000-0000-4000-a000-000000000002",
    active: false,
  },
  {
    id: "00000000-0000-4000-a000-000000000003",
    email: "pedro@venicio.com",
    personId: "00000000-0000-4000-a000-000000000003",
    deletedAt: new Date(),
  },
];

export async function seedUsers(prisma: PrismaClient): Promise<void> {
  const passwordHash = await argon2.hash(DEFAULT_PASSWORD);

  const { count } = await prisma.user.createMany({
    data: users.map((user) => ({ ...user, passwordHash })),
    skipDuplicates: true,
  });

  console.log(
    `[seed] Usuários: ${count} criado(s), ${users.length - count} já existia(m).`,
  );
}
