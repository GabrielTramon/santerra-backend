import { z } from "zod";

import { listQuerySchema } from "../../../../shared/http/request-schemas";
import {
  PERSON_OPTIONAL_FIELDS,
  PERSON_TYPES,
} from "../../domain/repositories/person-repository";

// A data vem com fuso (ex.: 2026-11-05T00:00:00-03:00): quem chama decide onde o dia começa.
const dateTimeQuerySchema = z.iso
  .datetime({ offset: true })
  .transform((value) => new Date(value));

export const createPersonSchema = z.object({
  name: z.string(),
  nationalId: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  email: z.email().nullish().or(z.literal("")),
});

export const updatePersonSchema = createPersonSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });

export const listPersonsQuerySchema = listQuerySchema.extend({
  type: z.enum(PERSON_TYPES).optional(),
  createdFrom: dateTimeQuerySchema.optional(),
  createdTo: dateTimeQuerySchema.optional(),
  // Lista separada por vírgula: ?missing=email,phoneNumber
  missing: z
    .string()
    .transform((value) => value.split(","))
    .pipe(z.array(z.enum(PERSON_OPTIONAL_FIELDS)))
    .optional(),
});
