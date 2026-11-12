import { Prisma } from "@prisma/client";

import { CommercialTrip } from "../../domain/entities/commercialTrip";
import { CommercialTripStatus } from "../../enumCommercialTrip/EnumCommercialTrip";

export const commercialTripInclude = {
  participants: {
    where: { employee: { deletedAt: null } },
    select: { employeeId: true },
  },
  harvests: {
    where: { harvest: { deletedAt: null } },
    select: { harvestId: true },
  },
  recommendations: {
    where: { product: { deletedAt: null } },
    select: { productId: true },
  },
  files: {
    where: { file: { deletedAt: null } },
    select: { fileId: true },
  },
} satisfies Prisma.CommercialTripInclude;

type PrismaCommercialTrip = Prisma.CommercialTripGetPayload<{
  include: typeof commercialTripInclude;
}>;

export class PrismaCommercialTripMapper {
  static toDomain(raw: PrismaCommercialTrip): CommercialTrip {
    return CommercialTrip.reconstitute({
      id: raw.id,
      performedActionDescription: raw.performedActionDescription,
      followUpDetails: raw.followUpDetails,
      pendingIssuesDescription: raw.pendingIssuesDescription,
      status: raw.status as CommercialTripStatus,
      tripDate: raw.tripDate,
      expectedDate: raw.expectedDate,
      producerId: raw.producerId,
      responsibleId: raw.responsibleId,
      companyId: raw.companyId,
      participantIds: raw.participants.map((participant) => participant.employeeId),
      harvestIds: raw.harvests.map((harvest) => harvest.harvestId),
      recommendedProductIds: raw.recommendations.map((recommendation) => recommendation.productId),
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
