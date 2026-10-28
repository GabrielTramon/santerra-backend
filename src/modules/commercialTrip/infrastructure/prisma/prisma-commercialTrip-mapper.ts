import { CommercialTrip as PrismaCommercialTrip } from "@prisma/client";

import { CommercialTrip } from "../../domain/entities/commercialTrip";
import { CommercialTripStatus } from "../../enumCommercialTrip/EnumCommercialTrip";

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
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      createdById: raw.createdById,
      updatedById: raw.updatedById,
      deletedById: raw.deletedById,
    });
  }
}
