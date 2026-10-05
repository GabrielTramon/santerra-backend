import { z } from "zod";

export const createManufacturerSchema = z.object({
  name: z.string(),
  registrationNumber: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  email: z.string().nullish(),
  passwordHash: z.string().nullish(),
});

export const updateManufacturerSchema = createManufacturerSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });
