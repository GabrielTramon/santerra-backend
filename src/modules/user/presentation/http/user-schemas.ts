import { z } from "zod";

const MIN_PASSWORD_LENGTH = 8;

export const createUserSchema = z.object({
  email: z.email(),
  personId: z.uuid(),
  password: z.string().min(MIN_PASSWORD_LENGTH),
  active: z.boolean().optional(),
});

export const updateUserSchema = createUserSchema
  .omit({ personId: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });
