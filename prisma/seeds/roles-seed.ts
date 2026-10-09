import { Prisma, PrismaClient } from "@prisma/client";

const roles: Prisma.RoleCreateManyInput[] = [
  {
    id: "00000000-0000-4000-a000-000000000001",
    name: "Admin",
    description: "Administrador do sistema, com acesso a todas as funcionalidades.",
    companyId: "00000000-0000-4000-a000-000000000001",
  },
  {
    id: "00000000-0000-4000-a000-000000000002",
    name: "AGD",
    description: "Acesso a funcionalidades específicas para o papel de AGD.",
    companyId: "00000000-0000-4000-a000-000000000002",
  },
  {
    id: "00000000-0000-4000-a000-000000000003",
    name: "Vendedor (excluída)",
    description: "Cargo com soft delete, não deve aparecer nas listagens.",
    companyId: "00000000-0000-4000-a000-000000000002",
    deletedAt: new Date(),
  },
];

export async function seedRoles(prisma: PrismaClient): Promise<void> {
  const { count } = await prisma.role.createMany({
    data: roles,
    skipDuplicates: true,
  });

  console.log(
    `[seed] Cargo: ${count} criado(s), ${roles.length - count} já existia(m).`,
  );
}
