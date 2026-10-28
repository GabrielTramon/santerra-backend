import { Prisma, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

import { CommercialTrip } from "../../domain/entities/commercialTrip";
import {
  CommercialTripRepository,
  FindCommercialTripsParams,
  FindCommercialTripsResult,
} from "../../domain/repositories/commercialTrip-repository";
import { PrismaCommercialTripMapper } from "./prisma-commercialTrip-mapper";

@injectable()
export class PrismaCommercialTripRepository implements CommercialTripRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async create(commercialTrip: CommercialTrip): Promise<CommercialTrip> {
    const data = commercialTrip.toObject();
    const createdCommercialTrip = await this.prisma.commercialTrip.create({ data });

    return PrismaCommercialTripMapper.toDomain(createdCommercialTrip);
  }

  async findById(
    id: string,
    companyId: string,
    includeDeleted = false,
  ): Promise<CommercialTrip | null> {
    const commercialTrip = await this.prisma.commercialTrip.findFirst({
      where: {
        id,
        companyId,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return commercialTrip ? PrismaCommercialTripMapper.toDomain(commercialTrip) : null;
  }

  async findMany(params: FindCommercialTripsParams): Promise<FindCommercialTripsResult> {
    const where: Prisma.CommercialTripWhereInput = {
      companyId: params.companyId,
      deletedAt: params.includeDeleted ? undefined : null,
      OR: params.search
        ? [
          {
            producer: {
              is: {
                person: {
                  is: {
                    name: { contains: params.search, mode: "insensitive", }
                  }
                }
              }
            }
          },
        ]
        : undefined,
    };

    const [commercialTrips, total] = await this.prisma.$transaction([
      this.prisma.commercialTrip.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.prisma.commercialTrip.count({ where }),
    ]);

    return {
      commercialTrips: commercialTrips.map(PrismaCommercialTripMapper.toDomain),
      total,
    };
  }

  async update(commercialTrip: CommercialTrip): Promise<CommercialTrip> {
    const data = commercialTrip.toObject();
    const updatedCommercialTrip = await this.prisma.commercialTrip.update({
      where: {
        id: data.id,
        companyId: data.companyId,
        deletedAt: null,
      },
      data: {
        performedActionDescription: data.performedActionDescription,
        followUpDetails: data.followUpDetails,
        pendingIssuesDescription: data.pendingIssuesDescription,
        status: data.status,
        tripDate: data.tripDate,
        expectedDate: data.expectedDate,
        producerId: data.producerId,
        responsibleId: data.responsibleId,
        updatedAt: data.updatedAt,
        updatedById: data.updatedById,
      },
    });

    return PrismaCommercialTripMapper.toDomain(updatedCommercialTrip);
  }

  async delete(commercialTrip: CommercialTrip): Promise<void> {
    const data = commercialTrip.toObject();

    await this.prisma.commercialTrip.update({
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
