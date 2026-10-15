import { Prisma, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

import { User } from "../../domain/entities/user";
import {
  UserRepository,
  FindUsersParams,
  FindUsersResult,
} from "../../domain/repositories/user-repository";
import { PrismaUserMapper } from "./prisma-user-mapper";

@injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(user: User): Promise<User> {
    const data = user.toObject();
    const createdUser = await this.prisma.user.create({ data });

    return PrismaUserMapper.toDomain(createdUser);
  }

  async findById(id: string, includeDeleted = false): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  // email e personId são únicos no banco mesmo para registros excluídos,
  // por isso as buscas abaixo não filtram deletedAt.
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async findByPersonId(personId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { personId } });

    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async findMany(params: FindUsersParams): Promise<FindUsersResult> {
    const where: Prisma.UserWhereInput = {
      deletedAt: params.includeDeleted ? undefined : null,
      OR: params.search
        ? [
            { email: { contains: params.search, mode: "insensitive" } },
            {
              person: {
                name: { contains: params.search, mode: "insensitive" },
              },
            },
          ]
        : undefined,
    };

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users: users.map(PrismaUserMapper.toDomain),
      total,
    };
  }

  async update(user: User): Promise<User> {
    const data = user.toObject();
    const updatedUser = await this.prisma.user.update({
      where: {
        id: data.id,
        deletedAt: null,
      },
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        active: data.active,
        updatedAt: data.updatedAt,
        updatedById: data.updatedById,
      },
    });

    return PrismaUserMapper.toDomain(updatedUser);
  }

  async delete(user: User): Promise<void> {
    const data = user.toObject();

    await this.prisma.user.update({
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
