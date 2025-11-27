import { getRequestEvent } from "$app/server";

import { LATEST_QUESTIONS_LIMIT } from "$/utils";
import type { QuestionPublic } from "$/utils/types";
import { QuestionForm } from "$/utils/zod/forms";

export async function askQuestion(question: QuestionForm) {
  const event = getRequestEvent();

  const { supabase, auth } = event.locals;
  const { success, data } = QuestionForm.safeParse(question);

  if (!success || !auth.user)
    return null;

  const res = await supabase.admin
    .from('questions')
    .insert({ ...data, user:auth.user.id })
    .select('*, user:users(*)')
    .maybeSingle();

  if (!res.data)
    return null;

  return {
    uuid:       res.data.uuid,
    title:      res.data.title,
    body:       res.data.body,
    tags:       res.data.tags,
    user:       res.data.user,
    created_at: res.data.created_at,
  } as QuestionPublic;
}

export async function getQuestionsLatest() {
  const event = getRequestEvent();

  const { supabase } = event.locals;

  const res = await supabase.admin
    .from('questions')
    .select('*, user:users(*)')
    .order('created_at', { ascending: false })
    .limit(LATEST_QUESTIONS_LIMIT);

  if (res.error || !res.data)
    return null;

  return res.data.map((q) => ({
    uuid:       q.uuid,
    title:      q.title,
    body:       q.body,
    tags:       q.tags,
    user:       q.user,
    created_at: q.created_at,
  } as QuestionPublic));
}
