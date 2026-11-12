import { Prisma } from "@prisma/client";

import { Member } from "../../domain/entities/member";

export const memberInclude = {
  user: { select: { name: true, email: true } },
  userRoles: {
    where: { role: { deletedAt: null } },
    select: { roleId: true },
  },
} satisfies Prisma.UserCompanyInclude;

type PrismaMember = Prisma.UserCompanyGetPayload<{ include: typeof memberInclude }>;

export class PrismaMemberMapper {
  static toDomain(raw: PrismaMember): Member {
    return Member.reconstitute({
      id: raw.id,
      userId: raw.userId,
      companyId: raw.companyId,
      name: raw.user.name,
      email: raw.user.email,
      isOwner: raw.isOwner,
      active: raw.active,
      roleIds: raw.userRoles.map((userRole) => userRole.roleId),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      createdById: raw.createdById,
      updatedById: raw.updatedById,
      deletedById: raw.deletedById,
    });
  }
}
