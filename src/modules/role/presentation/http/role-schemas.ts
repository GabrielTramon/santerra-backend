import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string(),
  description: z.string().nullish(),
  companyId: z.uuid(),
});

export const updateRoleSchema = createRoleSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });
