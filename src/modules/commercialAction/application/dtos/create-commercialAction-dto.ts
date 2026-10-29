export interface CreateCommercialActionDto {
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
