import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string(),
  description: z.string().nullish(),
  logo: z.string().nullish(),
});

export const updateCompanySchema = createCompanySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });
