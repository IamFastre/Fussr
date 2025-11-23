import z from "zod";

export type UsernameShape = z.infer<typeof UsernameShape>;

export const UsernameShape = z.string()
  .min(3).max(35)
  .regex(/^[a-z0-9._-]*$/i)
  .trim();

/* ========================================================================== */

export type EmailShape = z.infer<typeof EmailShape>;

export const EmailShape = z.email().trim();

/* ========================================================================== */

export type PasswordShape = z.infer<typeof PasswordShape>;

export const PasswordShape = z.string()
  .min(8).max(64)
  .regex(/^(?=.*[a-z])(?=.*[0-9]).*$/i)
  .trim();

/* ========================================================================== */

export type SignInForm = z.infer<typeof SignInForm>;

export const SignInForm = z.object({
  email: EmailShape,
  password: PasswordShape,
});

/* ========================================================================== */

export type SignUpForm = z.infer<typeof SignUpForm>;

export const SignUpForm = SignInForm.extend({
  username: UsernameShape,
});

/* ========================================================================== */

export type RecoveryForm = z.infer<typeof RecoveryForm>;

export const RecoveryForm = z.object({
  email: EmailShape,
});
