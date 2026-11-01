import { Prisma, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

import { CommercialAction } from "../../domain/entities/commercialAction";
import {
  CommercialActionRepository,
  FindCommercialActionsParams,
  FindCommercialActionsResult,
} from "../../domain/repositories/commercialAction-repository";
import { PrismaCommercialActionMapper } from "./prisma-commercialAction-mapper";

@injectable()
export class PrismaCommercialActionRepository implements CommercialActionRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async create(commercialAction: CommercialAction): Promise<CommercialAction> {
    const data = commercialAction.toObject();
    const createdCommercialAction = await this.prisma.commercialAction.create({ data });

    return PrismaCommercialActionMapper.toDomain(createdCommercialAction);
  }

  async findById(
    id: string,
    companyId: string,
    includeDeleted = false,
  ): Promise<CommercialAction | null> {
    const commercialAction = await this.prisma.commercialAction.findFirst({
      where: {
        id,
        companyId,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return commercialAction ? PrismaCommercialActionMapper.toDomain(commercialAction) : null;
  }

  async findMany(params: FindCommercialActionsParams): Promise<FindCommercialActionsResult> {
    const where: Prisma.CommercialActionWhereInput = {
      companyId: params.companyId,
      deletedAt: params.includeDeleted ? undefined : null,
      OR: params.search
        ? [
          {
            event: {
              is: {
                name: { contains: params.search, mode: "insensitive", }
              }
            }
          },
        ]
        : undefined,
    };

    const [commercialActions, total] = await this.prisma.$transaction([
      this.prisma.commercialAction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.prisma.commercialAction.count({ where }),
    ]);

    return {
      commercialActions: commercialActions.map(PrismaCommercialActionMapper.toDomain),
      total,
    };
  }

  async update(commercialAction: CommercialAction): Promise<CommercialAction> {
    const data = commercialAction.toObject();
    const updatedCommercialAction = await this.prisma.commercialAction.update({
      where: {
        id: data.id,
        companyId: data.companyId,
        deletedAt: null,
      },
      data: {
        description: data.description,
        eventId: data.eventId,
        price: data.price,
        initialDate: data.initialDate,
        finalDate: data.finalDate,
        walletId: data.walletId,
        responsibleId: data.responsibleId,
        invoiceNumber: data.invoiceNumber,
        updatedAt: data.updatedAt,
        updatedById: data.updatedById,
      },
    });

    return PrismaCommercialActionMapper.toDomain(updatedCommercialAction);
  }

  async delete(commercialAction: CommercialAction): Promise<void> {
    const data = commercialAction.toObject();

    await this.prisma.commercialAction.update({
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
