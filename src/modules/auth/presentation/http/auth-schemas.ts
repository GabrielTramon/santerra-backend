import { z } from "zod";

import { passwordSchema } from "../../../../shared/http/request-schemas";

export const signUpSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: passwordSchema,
  companyName: z.string(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const selectCompanySchema = z.object({
  companyId: z.uuid(),
});
