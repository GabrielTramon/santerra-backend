import { z } from "zod";

export const createCommercialActionSchema = z.object({
  description: z.string().nullish(),
  eventId: z.uuid(),
  price: z.number().nullish(),
  initialDate: z.coerce.date().nullish(),
  finalDate: z.coerce.date().nullish(),
  walletId: z.uuid(),
  responsibleId: z.uuid(),
  invoiceNumber: z.string().nullish(),
  producerGuestIds: z.array(z.uuid()).optional(),
  resellerGuestIds: z.array(z.uuid()).optional(),
  participantIds: z.array(z.uuid()).optional(),
  fileIds: z.array(z.uuid()).optional(),
});

export const updateCommercialActionSchema = createCommercialActionSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });
