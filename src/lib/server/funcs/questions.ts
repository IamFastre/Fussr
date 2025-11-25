import { getRequestEvent } from "$app/server";

import { QuestionForm } from "$/utils/zod/forms";

export async function askQuestion(question: QuestionForm) {
  const event = getRequestEvent();

  const { supabase, auth } = event.locals;
  const { success, data } = QuestionForm.safeParse(question);

  if (!success || !auth.user)
    return null;

  const res = await supabase.admin
    .from("questions")
    .insert({ ...data, user:auth.user.id })
    .select('*')
    .maybeSingle();

  return res.data;
}
