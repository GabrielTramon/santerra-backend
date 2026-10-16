import { z } from "zod";

import { passwordSchema } from "../../../../shared/http/request-schemas";

export const createUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: passwordSchema,
  active: z.boolean().optional(),
});

export const updateUserSchema = createUserSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });
