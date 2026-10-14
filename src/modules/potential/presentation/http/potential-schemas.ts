import { z } from "zod";

export const createPotentialSchema = z.object({
  name: z.string(),
  numericValue: z.number().nullish(),
  description: z.string().nullish(),
  companyId: z.uuid(),
});

export const updatePotentialSchema = createPotentialSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });
