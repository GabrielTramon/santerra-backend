import { z } from "zod";

import { listQuerySchema } from "../../../../shared/http/request-schemas";

export const createWalletSchema = z.object({
  value: z.number().optional(),
  userCompanyId: z.uuid(),
});

export const updateWalletSchema = createWalletSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });

export const listWalletsQuerySchema = listQuerySchema.extend({
  userCompanyId: z.uuid().optional(),
});
