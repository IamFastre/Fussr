import { getRequestEvent } from "$app/server";

import { LATEST_QUESTIONS_LIMIT } from "$/utils";
import type { QuestionPublic } from "$/utils/types";
import { QuestionForm } from "$/utils/zod/forms";

export async function getQuestionByUUID(uuid: string) {
  const event = getRequestEvent();

  const { supabase } = event.locals;

  const res = await supabase.admin
    .from('questions')
    .select('*, author:users(*)')
    .eq('uuid', uuid)
    .maybeSingle();

  if (!res.data)
    return null;

  return {
    uuid:       res.data.uuid,
    title:      res.data.title,
    body:       res.data.body,
    tags:       res.data.tags,
    score:      res.data.score,
    answers:    res.data.answers,
    follows:    res.data.follows,
    author:     res.data.author,
    created_at: res.data.created_at,
  } as QuestionPublic;
}

export async function askQuestion(question: QuestionForm) {
  const event = getRequestEvent();

  const { supabase, auth } = event.locals;
  const { success, data } = QuestionForm.safeParse(question);

  if (!success || !auth.user)
    return null;

  const res = await supabase.admin
    .from('questions')
    .insert({ ...data, author:auth.user.id })
    .select('*, author:users(*)')
    .maybeSingle();

  if (!res.data)
    return null;

  return {
    uuid:       res.data.uuid,
    title:      res.data.title,
    body:       res.data.body,
    tags:       res.data.tags,
    score:      res.data.score,
    answers:    res.data.answers,
    follows:    res.data.follows,
    author:     res.data.author,
    created_at: res.data.created_at,
  } as QuestionPublic;
}

export async function getQuestionsLatest({ page }: { page:number }) {
  const event = getRequestEvent();

  const { supabase } = event.locals;

  const res = await supabase.admin
    .from('questions')
    .select('*, author:users(*)', { count:'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * LATEST_QUESTIONS_LIMIT, (page * LATEST_QUESTIONS_LIMIT) - 1);

  if (res.error || !res.data)
    return { list:[], total: 0 };

  const list = res.data.map(q => ({
    uuid:       q.uuid,
    title:      q.title,
    body:       q.body,
    tags:       q.tags,
    score:      q.score,
    answers:    q.answers,
    follows:    q.follows,
    author:     q.author,
    created_at: q.created_at,
  } as QuestionPublic));

  return {
    list,
    total: res.count ?? 0,
  }
}
