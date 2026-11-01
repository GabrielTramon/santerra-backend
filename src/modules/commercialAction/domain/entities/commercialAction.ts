import { randomUUID } from "node:crypto";

import { DomainError } from "../../../../shared/domain/errors/domain-error";

export interface CommercialActionProps {
  id: string;
  description: string | null;
  eventId: string;
  price: number | null;
  initialDate: Date | null;
  finalDate: Date | null;
  walletId: string;
  responsibleId: string;
  companyId: string;
  invoiceNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdById: string | null;
  updatedById: string | null;
  deletedById: string | null;
}

interface CreateCommercialActionProps {
  description?: string | null;
  eventId: string;
  price?: number | null;
  initialDate?: Date | null;
  finalDate?: Date | null;
  walletId: string;
  responsibleId: string;
  companyId: string;
  invoiceNumber?: string | null;
  createdById?: string | null;
}

export interface UpdateCommercialActionProps {
  description?: string | null;
  eventId?: string;
  price?: number | null;
  initialDate?: Date | null;
  finalDate?: Date | null;
  walletId?: string;
  responsibleId?: string;
  invoiceNumber?: string | null;
  updatedById?: string | null;
}

export class CommercialAction {
  private constructor(private readonly props: CommercialActionProps) {}

  static create(
    input: CreateCommercialActionProps,
    id = randomUUID(),
    createdAt = new Date(),
  ): CommercialAction {
    const eventId = CommercialAction.normalizeEventId(input.eventId);
    const walletId = CommercialAction.normalizeWalletId(input.walletId);
    const responsibleId = CommercialAction.normalizeResponsibleId(input.responsibleId);

    return new CommercialAction({
      id,
      description: input.description ?? null,
      eventId,
      price: input.price ?? null,
      initialDate: input.initialDate ?? null,
      finalDate: input.finalDate ?? null,
      walletId,
      responsibleId,
      companyId: input.companyId,
      invoiceNumber: input.invoiceNumber ?? null,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
      createdById: input.createdById ?? null,
      updatedById: null,
      deletedById: null,
    });
  }

  static reconstitute(props: CommercialActionProps): CommercialAction {
    return new CommercialAction({ ...props });
  }

  update(input: UpdateCommercialActionProps, updatedAt = new Date()): void {
    
    if (input.description !== undefined) {
      this.props.description = input.description ?? null;
    }
    
    if (input.eventId !== undefined) {
      this.props.eventId = CommercialAction.normalizeEventId(input.eventId);
    }

    if (input.price !== undefined) {
      this.props.price = input.price ?? null;
    }

    if (input.initialDate !== undefined) {
      this.props.initialDate = input.initialDate ?? null;
    }

    if (input.finalDate !== undefined) {
      this.props.finalDate = input.finalDate ?? null;
    }
    
    if (input.walletId !== undefined) {
      this.props.walletId = CommercialAction.normalizeWalletId(input.walletId);
    }

    if (input.responsibleId !== undefined) {
      this.props.responsibleId = CommercialAction.normalizeResponsibleId(input.responsibleId);
    }

    if (input.invoiceNumber !== undefined) {
      this.props.invoiceNumber = input.invoiceNumber ?? null;
    }

    this.props.updatedById = input.updatedById ?? null;
    this.props.updatedAt = updatedAt;
  }

  delete(deletedById: string | null = null, deletedAt = new Date()): void {
    this.props.deletedAt = deletedAt;
    this.props.deletedById = deletedById;
  }

  toObject(): CommercialActionProps {
    return { ...this.props };
  }
  
  private static normalizeEventId(eventId: string): string {
    if (typeof eventId !== "string" || eventId.trim().length === 0) {
      throw new DomainError("O ID do evento é obrigatório.");
    }

    return eventId.trim();
  }
  
  private static normalizeWalletId(walletId: string): string {
    if (typeof walletId !== "string" || walletId.trim().length === 0) {
      throw new DomainError("O ID da carteira é obrigatório.");
    }

    return walletId.trim();
  }

  private static normalizeResponsibleId(responsibleId: string): string {
    if (typeof responsibleId !== "string" || responsibleId.trim().length === 0) {
      throw new DomainError("O ID do responsável é obrigatório.");
    }

    return responsibleId.trim();
  }

}
