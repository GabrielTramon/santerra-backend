import { Prisma, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

import { Member } from "../../domain/entities/member";
import {
  MemberRepository,
  FindMembersParams,
  FindMembersResult,
} from "../../domain/repositories/member-repository";
import { PrismaMemberMapper, memberInclude } from "./prisma-member-mapper";

@injectable()
export class PrismaMemberRepository implements MemberRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(
    id: string,
    companyId: string,
    includeDeleted = false,
  ): Promise<Member | null> {
    const member = await this.prisma.userCompany.findFirst({
      where: {
        id,
        companyId,
        deletedAt: includeDeleted ? undefined : null,
      },
      include: memberInclude,
    });

    return member ? PrismaMemberMapper.toDomain(member) : null;
  }

  async findByUserId(
    userId: string,
    companyId: string,
    includeDeleted = false,
  ): Promise<Member | null> {
    const member = await this.prisma.userCompany.findFirst({
      where: {
        userId,
        companyId,
        deletedAt: includeDeleted ? undefined : null,
      },
      include: memberInclude,
    });

    return member ? PrismaMemberMapper.toDomain(member) : null;
  }

  async findMany(params: FindMembersParams): Promise<FindMembersResult> {
    const where: Prisma.UserCompanyWhereInput = {
      companyId: params.companyId,
      deletedAt: params.includeDeleted ? undefined : null,
      user: params.search
        ? {
            OR: [
              { name: { contains: params.search, mode: "insensitive" } },
              { email: { contains: params.search, mode: "insensitive" } },
            ],
          }
        : undefined,
    };

    const [members, total] = await this.prisma.$transaction([
      this.prisma.userCompany.findMany({
        where,
        include: memberInclude,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.prisma.userCompany.count({ where }),
    ]);

    return {
      members: members.map(PrismaMemberMapper.toDomain),
      total,
    };
  }

  async update(member: Member): Promise<Member> {
    const data = member.toObject();
    const [, , updatedMember] = await this.prisma.$transaction([
      this.prisma.userRole.deleteMany({ where: { userCompanyId: data.id } }),
      this.prisma.userRole.createMany({
        data: data.roleIds.map((roleId) => ({
          roleId,
          userCompanyId: data.id,
          companyId: data.companyId,
        })),
      }),
      this.prisma.userCompany.update({
        where: {
          id: data.id,
          companyId: data.companyId,
          deletedAt: null,
        },
        data: {
          active: data.active,
          updatedAt: data.updatedAt,
          updatedById: data.updatedById,
        },
        include: memberInclude,
      }),
    ]);

    return PrismaMemberMapper.toDomain(updatedMember);
  }

  async delete(member: Member): Promise<void> {
    const data = member.toObject();

    await this.prisma.userCompany.update({
      where: {
        id: data.id,
        companyId: data.companyId,
        deletedAt: null,
      },
      data: {
        deletedAt: data.deletedAt,
        deletedById: data.deletedById,
      },
    });
  }
}
