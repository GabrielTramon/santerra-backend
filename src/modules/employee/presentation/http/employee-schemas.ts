import { z } from "zod";

export const createEmployeeSchema = z.object({
  personId: z.uuid(),
  hiredAt: z.coerce.date().nullish(),
  terminatedAt: z.coerce.date().nullish(),
});

export const updateEmployeeSchema = createEmployeeSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });
