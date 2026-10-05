import { z } from "zod";

const MAX_LIMIT = 100;

export const idParamSchema = z.object({
  id: z.uuid(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(MAX_LIMIT).optional(),
  search: z.string().optional(),
  includeDeleted: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});
