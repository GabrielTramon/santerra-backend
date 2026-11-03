import { Prisma } from "@prisma/client";

import { CommercialAction } from "../../domain/entities/commercialAction";

export const commercialActionInclude = {
  producerGuests: {
    where: { producer: { deletedAt: null } },
    select: { producerId: true },
  },
  resellerGuests: {
    where: { reseller: { deletedAt: null } },
    select: { resellerId: true },
  },
  participants: {
    where: { employee: { deletedAt: null } },
    select: { employeeId: true },
  },
  files: {
    where: { file: { deletedAt: null } },
    select: { fileId: true },
  },
} satisfies Prisma.CommercialActionInclude;

type PrismaCommercialAction = Prisma.CommercialActionGetPayload<{
  include: typeof commercialActionInclude;
}>;

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
      producerGuestIds: raw.producerGuests.map((guest) => guest.producerId),
      resellerGuestIds: raw.resellerGuests.map((guest) => guest.resellerId),
      participantIds: raw.participants.map((participant) => participant.employeeId),
      fileIds: raw.files.map((file) => file.fileId),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      createdById: raw.createdById,
      updatedById: raw.updatedById,
      deletedById: raw.deletedById,
    });
  }
}
