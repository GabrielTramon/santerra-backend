import { z } from "zod";

export const createResellerSchema = z.object({
  name: z.string(),
  registrationNumber: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  email: z.email().nullish().or(z.literal("")),
  companyId: z.uuid(),
});

export const updateResellerSchema = createResellerSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });
