import { z } from "zod";

import { CommercialTripStatus } from "../../enumCommercialTrip/EnumCommercialTrip";

export const createCommercialTripSchema = z.object({
  performedActionDescription: z.string().nullish(),
  followUpDetails: z.string().nullish(),
  pendingIssuesDescription: z.string().nullish(),
  status: z.enum(CommercialTripStatus),
  tripDate: z.coerce.date().nullish(),
  expectedDate: z.coerce.date().nullish(),
  producerId: z.string(),
  responsibleId: z.string(),
});

export const updateCommercialTripSchema = createCommercialTripSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });
