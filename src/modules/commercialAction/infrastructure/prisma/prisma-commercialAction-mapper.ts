import { CommercialAction as PrismaCommercialAction } from "@prisma/client";

import { CommercialAction } from "../../domain/entities/commercialAction";

export class PrismaCommercialActionMapper {
  static toDomain(raw: PrismaCommercialAction): CommercialAction {
    return CommercialAction.reconstitute({
      id: raw.id,
      description: raw.description,
      eventId: raw.eventId,
      price: raw.price?.toNumber() ?? null,
      initialDate: raw.initialDate,
      finalDate: raw.finalDate,
      walletId: raw.walletId,
      responsibleId: raw.responsibleId,
      companyId: raw.companyId,
      invoiceNumber: raw.invoiceNumber,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      createdById: raw.createdById,
      updatedById: raw.updatedById,
      deletedById: raw.deletedById,
    });
  }
}
