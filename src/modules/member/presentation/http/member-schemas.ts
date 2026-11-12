import { z } from "zod";

export const updateMemberSchema = z
  .object({
    active: z.boolean().optional(),
    roleIds: z.array(z.uuid()).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });
