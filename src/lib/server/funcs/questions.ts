import { getRequestEvent } from "$app/server";

import { LATEST_QUESTIONS_LIMIT } from "$/utils";
import type { QuestionPersonal, QuestionPublic } from "$/utils/types";
import { QuestionForm } from "$/utils/zod/forms";

export async function getQuestionByUUID(uuid: string) {
  const event = getRequestEvent();

  const { supabase, auth } = event.locals;

  const promises = await Promise.all([
    supabase.admin
      .from('questions')
      .select('*, author:users(*)')
      .eq('uuid', uuid)
      .single(),

    supabase.admin
      .from('question_votes')
      .select('*')
      .eq('author', auth.user?.id ?? '')
      .eq('question', uuid)
      .single(),

    supabase.admin
      .from('question_follows')
      .select('*')
      .eq('user', auth.user?.id ?? '')
      .eq('question', uuid)
      .single(),
  ]);

  const question = promises[0].data;
  const vote     = promises[1].data;
  const follow   = promises[2].data;

  if (!question)
    return null;

  return {
    uuid:       question.uuid,
    title:      question.title,
    body:       question.body,
    tags:       question.tags,
    score:      question.score,
    answers:    question.answers,
    follows:    question.follows,
    author:     question.author,
    created_at: question.created_at,

    vote:   !vote?.uuid ? 'none' : vote.sign ? 'up' : 'down',
    follow: !!follow?.uuid,
  } as QuestionPersonal;
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

export async function voteQuestion({ question, vote }: { question: string, vote: 'up' | 'down' | 'none' }) {
  const event = getRequestEvent();
  const { supabase, auth } = event.locals;

  if (!auth.user)
    return null;

  if (vote === 'none') {
    const res = await supabase.admin
      .from('question_votes')
      .delete({ })
      .eq('author', auth.user.id)
      .eq('question', question)
      .select('*')
      .single();

    if (!res.data)
      return null;

    return res.data.uuid;
  }

  else {
    const res = await supabase.admin
      .from('question_votes')
      .insert({ author:auth.user.id, question, sign:vote === 'up' })
      .select('*')
      .single();

    if (!res.data)
      return null;

    return res.data.uuid;
  }
}

export async function followQuestion(uuid: string) {
  const event = getRequestEvent();
  const { supabase, auth } = event.locals;

  if (!auth.user)
    return null;

  const res = await supabase.admin
    .from('question_follows')
    .insert({ user:auth.user.id, question:uuid })
    .select('*')
    .single();

  if (res.error?.message.includes('duplicate')) {
    const res = await supabase.admin
      .from('question_follows')
      .delete({ })
      .eq('user', auth.user.id)
      .eq('question', uuid)
      .select('*')
      .single();

    if (!res.data)
      return null;

    return res.data.uuid;
  }

  if (!res.data)
    return null;

  return res.data.uuid;
}

export async function deleteQuestion({ uuid }: { uuid:string }) {
  const event = getRequestEvent();
  const { supabase, auth } = event.locals;

  if (!auth.user)
    return null;

  const question = await supabase.admin
    .from('questions')
    .delete({ })
    .eq('uuid', uuid)
    .eq('author', auth.user.id) // <- this makes sure the user actually owns the question
    .select('uuid')
    .single();

  if (question.error)
    return null;

  return question.data.uuid;
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
