import { Prisma, PrismaClient } from "@prisma/client";

const permissions: Prisma.PermissionCreateManyInput[] = [
  {
    id: "00000000-0000-4000-a000-000000000001",
    name: "Criar usuários",
    description: "Permissão para criar novos usuários no sistema.",
  },
  {
    id: "00000000-0000-4000-a000-000000000002",
    name: "Editar usuários",
    description: "Permissão para editar usuários existentes no sistema.",
  },
];

export async function seedPermissions(prisma: PrismaClient): Promise<void> {
  const { count } = await prisma.permission.createMany({
    data: permissions,
    skipDuplicates: true,
  });

  console.log(
    `[seed] Permissões: ${count} criado(s), ${permissions.length - count} já existia(m).`,
  );
}
