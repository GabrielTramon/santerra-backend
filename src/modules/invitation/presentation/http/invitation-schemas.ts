import { z } from "zod";

import { passwordSchema } from "../../../../shared/http/request-schemas";

export const createInvitationSchema = z.object({
  email: z.email(),
  roleIds: z.array(z.uuid()).optional(),
});

export const acceptInvitationSchema = z.object({
  token: z.string().min(1),
  name: z.string().optional(),
  password: passwordSchema.optional(),
});
