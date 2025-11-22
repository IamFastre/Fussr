import z from "zod";

export const AuthForm = z.object({
  username: z.string()
    .min(3).max(35)
    .regex(/^[a-z0-9._-]*$/i)
    .optional(),
  email: z.email(),
  password: z.string()
    .min(8).max(64)
    .regex(/^(?=.*[a-z])(?=.*[0-9]).*$/i),
});
