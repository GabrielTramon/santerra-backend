import { Prisma, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

import { Role } from "../../domain/entities/role";
import {
  RoleRepository,
  FindRolesParams,
  FindRolesResult,
} from "../../domain/repositories/role-repository";
import { PrismaRoleMapper } from "./prisma-role-mapper";

@injectable()
export class PrismaRoleRepository implements RoleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(role: Role): Promise<Role> {
    const data = role.toObject();
    const createdRole = await this.prisma.role.create({ data });

    return PrismaRoleMapper.toDomain(createdRole);
  }

  async findById(id: string, includeDeleted = false): Promise<Role | null> {
    const role = await this.prisma.role.findFirst({
      where: {
        id,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return role ? PrismaRoleMapper.toDomain(role) : null;
  }

  async findMany(params: FindRolesParams): Promise<FindRolesResult> {
    const where: Prisma.RoleWhereInput = {
      deletedAt: params.includeDeleted ? undefined : null,
      OR: params.search
        ? [
            { name: { contains: params.search, mode: "insensitive" } },
            { description: { contains: params.search, mode: "insensitive" } },
          ]
        : undefined,
    };

    const [roles, total] = await this.prisma.$transaction([
      this.prisma.role.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.prisma.role.count({ where }),
    ]);

    return {
      roles: roles.map(PrismaRoleMapper.toDomain),
      total,
    };
  }

  async update(role: Role): Promise<Role> {
    const data = role.toObject();
    const updatedRole = await this.prisma.role.update({
      where: {
        id: data.id,
        deletedAt: null,
      },
      data: {
        name: data.name,
        description: data.description,
        companyId: data.companyId,
        updatedAt: data.updatedAt,
        updatedById: data.updatedById,
      },
    });

    return PrismaRoleMapper.toDomain(updatedRole);
  }

  async delete(role: Role): Promise<void> {
    const data = role.toObject();

    await this.prisma.role.update({
      where: {
        id: data.id,
        deletedAt: null,
      },
      data: {
        deletedAt: data.deletedAt,
        deletedById: data.deletedById,
      },
    });
  }
}
