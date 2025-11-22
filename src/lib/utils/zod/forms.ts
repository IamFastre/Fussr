import z from "zod";

export type SignInForm = z.infer<typeof SignInForm>;

export const SignInForm = z.object({
  email: z.email()
    .trim(),
  password: z.string()
    .min(8).max(64)
    .regex(/^(?=.*[a-z])(?=.*[0-9]).*$/i)
    .trim(),
});

/* ========================================================================== */

export type SignUpForm = z.infer<typeof SignUpForm>;

export const SignUpForm = SignInForm.extend({
  username: z.string()
    .min(3).max(35)
    .regex(/^[a-z0-9._-]*$/i)
    .trim(),
});
