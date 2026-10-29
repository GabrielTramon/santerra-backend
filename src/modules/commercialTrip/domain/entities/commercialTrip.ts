import { randomUUID } from "node:crypto";

import { DomainError } from "../../../../shared/domain/errors/domain-error";
import { CommercialTripStatus } from "../../enumCommercialTrip/EnumCommercialTrip";

export interface CommercialTripProps {
  id: string;
  performedActionDescription: string | null;
  followUpDetails: string | null;
  pendingIssuesDescription: string | null;
  status: CommercialTripStatus,
  tripDate: Date | null,
  expectedDate: Date | null,
  producerId: string,
  responsibleId: string,
  companyId: string
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdById: string | null;
  updatedById: string | null;
  deletedById: string | null;
}

interface CreateCommercialTripProps {
  performedActionDescription?: string | null;
  followUpDetails?: string | null;
  pendingIssuesDescription?: string | null;
  status: CommercialTripStatus,
  tripDate?: Date | null,
  expectedDate?: Date | null,
  producerId: string,
  responsibleId: string,
  companyId: string
  createdById?: string | null;
}

export interface UpdateCommercialTripProps {
  performedActionDescription?: string | null;
  followUpDetails?: string | null;
  pendingIssuesDescription?: string | null;
  status?: CommercialTripStatus,
  tripDate?: Date | null,
  expectedDate?: Date | null,
  producerId?: string,
  responsibleId?: string,
  updatedById?: string | null;
}

export class CommercialTrip {
  private constructor(private readonly props: CommercialTripProps) {}

  static create(
    input: CreateCommercialTripProps,
    id = randomUUID(),
    createdAt = new Date(),
  ): CommercialTrip {
    const producerId = CommercialTrip.normalizeProducerId(input.producerId);
    const responsibleId = CommercialTrip.normalizeResponsibleId(input.responsibleId);

    return new CommercialTrip({
      id,
      performedActionDescription: input.performedActionDescription ?? null,
      followUpDetails: input.followUpDetails ?? null,
      pendingIssuesDescription: input.pendingIssuesDescription ?? null,
      status: input.status,
      tripDate: input.tripDate ?? null,
      expectedDate: input.expectedDate ?? null,
      producerId,
      responsibleId,
      companyId: input.companyId,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
      createdById: input.createdById ?? null,
      updatedById: null,
      deletedById: null,
    });
  }

  static reconstitute(props: CommercialTripProps): CommercialTrip {
    return new CommercialTrip({ ...props });
  }

  update(input: UpdateCommercialTripProps, updatedAt = new Date()): void {
    
    if (input.performedActionDescription !== undefined) {
      this.props.performedActionDescription = input.performedActionDescription;
    }

    if (input.followUpDetails !== undefined) {
      this.props.followUpDetails = input.followUpDetails;
    }

    if (input.pendingIssuesDescription !== undefined) {
      this.props.pendingIssuesDescription = input.pendingIssuesDescription;
    }

    if (input.status !== undefined) {
      this.props.status = input.status;
    }

    if (input.tripDate !== undefined) {
      this.props.tripDate = input.tripDate;
    }

    if (input.expectedDate !== undefined) {
      this.props.expectedDate = input.expectedDate;
    }

    if (input.producerId !== undefined) {
      this.props.producerId = CommercialTrip.normalizeProducerId(input.producerId);
    }

    if (input.responsibleId !== undefined) {
      this.props.responsibleId = CommercialTrip.normalizeResponsibleId(input.responsibleId);
    }

    this.props.updatedById = input.updatedById ?? null;
    this.props.updatedAt = updatedAt;
  }

  delete(deletedById: string | null = null, deletedAt = new Date()): void {
    this.props.deletedAt = deletedAt;
    this.props.deletedById = deletedById;
  }

  toObject(): CommercialTripProps {
    return { ...this.props };
  }

  private static normalizeProducerId(producerId: string): string {
    if (typeof producerId !== "string" || producerId.trim().length === 0) {
      throw new DomainError("O ID do produtor é obrigatório.");
    }

    return producerId.trim();
  }

  private static normalizeResponsibleId(responsibleId: string): string {
    if (typeof responsibleId !== "string" || responsibleId.trim().length === 0) {
      throw new DomainError("O ID do responsável é obrigatório.");
    }

    return responsibleId.trim();
  }
}
