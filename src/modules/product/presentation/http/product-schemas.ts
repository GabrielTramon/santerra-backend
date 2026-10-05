import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string().nullish(),
  price: z.number().nullish(),
  costPrice: z.number().nullish(),
  manufacturerId: z.uuid(),
  companyId: z.uuid(),
});

export const updateProductSchema = createProductSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });
