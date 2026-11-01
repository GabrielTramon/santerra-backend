import { z } from "zod";

export const createCommercialActionSchema = z.object({
  description: z.string().nullish(),
  eventId: z.string(),
  price: z.number().nullish(),
  initialDate: z.coerce.date().nullish(),
  finalDate: z.coerce.date().nullish(),
  walletId: z.string(),
  responsibleId: z.string(),
  invoiceNumber: z.string().nullish(),
});

export const updateCommercialActionSchema = createCommercialActionSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });
