import z from "zod";

import { COUNTRIES } from "../consts";
import { keys } from "../funcs";

/* ========================================================================== */

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

/* ========================================================================== */
/* ========================================================================== */
/* ========================================================================== */

export type QuestionForm = z.infer<typeof QuestionForm>;

export const QuestionForm = z.object({
  title: z.string()
    .min(16).max(160)
    .trim(),
  body: z.string()
    .min(160).max(3000)
    .trim(),
  tags: z.array(
    z.string()
      .min(2).max(35)
      .regex(/^[a-z0-9-]+$/)
      .trim()
  ),
});

/* ========================================================================== */

export type AnswerForm = z.infer<typeof AnswerForm>;

export const AnswerForm = z.object({
  question: z.uuid(),
  body: z.string()
    .min(60).max(3000)
    .trim(),
});

/* ========================================================================== */

export type ProfileEditForm = z.infer<typeof ProfileEditForm>;

export const ProfileEditForm = z.object({
  avatar: z.url({ protocol:/^data$/ })
    .nullable(),
  display_name: z.string()
    .min(0).max(35)
    .trim(),
  bio: z.string()
    .min(0).max(512)
    .trim(),
  country: z.enum(keys(COUNTRIES))
});
