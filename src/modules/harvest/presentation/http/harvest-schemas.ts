import { z } from "zod";


export const createHarvestSchema = z.object({
  name: z.string(),
});

export const updateHarvestSchema = createHarvestSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });
