import { Prisma, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

import { Person } from "../../domain/entities/person";
import {
  PersonRepository,
  FindPersonsParams,
  FindPersonsResult,
} from "../../domain/repositories/person-repository";
import { PrismaPersonMapper } from "./prisma-person-mapper";

@injectable()
export class PrismaPersonRepository implements PersonRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(person: Person): Promise<Person> {
    const data = person.toObject();
    const createdPerson = await this.prisma.person.create({ data });

    return PrismaPersonMapper.toDomain(createdPerson);
  }

  async findById(id: string, includeDeleted = false): Promise<Person | null> {
    const person = await this.prisma.person.findFirst({
      where: {
        id,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return person ? PrismaPersonMapper.toDomain(person) : null;
  }

  async findMany(params: FindPersonsParams): Promise<FindPersonsResult> {
    const where: Prisma.PersonWhereInput = {
      deletedAt: params.includeDeleted ? undefined : null,
      OR: params.search
        ? [
            { name: { contains: params.search, mode: "insensitive" } },
            { nationalId: { contains: params.search, mode: "insensitive" } },
          ]
        : undefined,
    };

    const [persons, total] = await this.prisma.$transaction([
      this.prisma.person.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.prisma.person.count({ where }),
    ]);

    return {
      persons: persons.map(PrismaPersonMapper.toDomain),
      total,
    };
  }

  async update(person: Person): Promise<Person> {
    const data = person.toObject();
    const updatedPerson = await this.prisma.person.update({
      where: {
        id: data.id,
        deletedAt: null,
      },
      data: {
        name: data.name,
        nationalId: data.nationalId,
        phoneNumber: data.phoneNumber,
        email: data.email,
        updatedAt: data.updatedAt,
        updatedById: data.updatedById,
      },
    });

    return PrismaPersonMapper.toDomain(updatedPerson);
  }

  async delete(person: Person): Promise<void> {
    const data = person.toObject();

    await this.prisma.person.update({
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
