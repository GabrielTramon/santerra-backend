import { Prisma, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

import { Producer } from "../../domain/entities/producer";
import {
  ProducerRepository,
  FindProducersParams,
  FindProducersResult,
} from "../../domain/repositories/producer-repository";
import { PrismaProducerMapper } from "./prisma-producer-mapper";

@injectable()
export class PrismaProducerRepository implements ProducerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(producer: Producer): Promise<Producer> {
    const data = producer.toObject();
    const createdProducer = await this.prisma.producer.create({ data });

    return PrismaProducerMapper.toDomain(createdProducer);
  }

  async findById(
    id: string,
    companyId: string,
    includeDeleted = false,
  ): Promise<Producer | null> {
    const producer = await this.prisma.producer.findFirst({
      where: {
        id,
        companyId,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return producer ? PrismaProducerMapper.toDomain(producer) : null;
  }

  async findByPersonId(
    personId: string,
    companyId: string,
  ): Promise<Producer | null> {
    const producer = await this.prisma.producer.findFirst({
      where: {
        personId,
        companyId,
        deletedAt: null,
      },
    });

    return producer ? PrismaProducerMapper.toDomain(producer) : null;
  }

  async findMany(params: FindProducersParams): Promise<FindProducersResult> {
    const where: Prisma.ProducerWhereInput = {
      companyId: params.companyId,
      potentialId: params.potentialId,
      deletedAt: params.includeDeleted ? undefined : null,
      OR: params.search
        ? [
            { person: { name: { contains: params.search, mode: "insensitive" } } },
            { person: { nationalId: { contains: params.search, mode: "insensitive" } } },
            { mainCrop: { contains: params.search, mode: "insensitive" } },
            { address: { contains: params.search, mode: "insensitive" } },
          ]
        : undefined,
    };

    const [producers, total] = await this.prisma.$transaction([
      this.prisma.producer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.prisma.producer.count({ where }),
    ]);

    return {
      producers: producers.map(PrismaProducerMapper.toDomain),
      total,
    };
  }

  async update(producer: Producer): Promise<Producer> {
    const data = producer.toObject();
    const updatedProducer = await this.prisma.producer.update({
      where: {
        id: data.id,
        companyId: data.companyId,
        deletedAt: null,
      },
      data: {
        personId: data.personId,
        potentialId: data.potentialId,
        address: data.address,
        mainCrop: data.mainCrop,
        totalArea: data.totalArea,
        updatedAt: data.updatedAt,
        updatedById: data.updatedById,
      },
    });

    return PrismaProducerMapper.toDomain(updatedProducer);
  }

  async delete(producer: Producer): Promise<void> {
    const data = producer.toObject();

    await this.prisma.producer.update({
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
