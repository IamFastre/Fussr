import { LATEST_QUESTIONS_LIMIT } from "$/utils";
import type { AnswerDetailed, QuestionPublic, UserPublic, VoteDetailed } from "$/utils/types";
import { UsernameShape } from "$/utils/zod/forms";
import { getRequestEvent } from "$app/server";

export async function getUserByUUID(uuid: string) {
  const event = getRequestEvent();

  const { supabase } = event.locals;

  const res = await supabase.admin
    .from('users')
    .select('*')
    .eq('uuid', uuid)
    .single();

  return res.data;
}

export async function getUserByName(username: string) {
  const event = getRequestEvent();

  const { supabase } = event.locals;
  const { success, data } = UsernameShape.safeParse(username);

  if (!success)
    return null;

  const res = await supabase.admin
    .from('users')
    .select('*')
    .ilike('username', data)
    .single();

  if (!res.data)
    return null;

  return {
    uuid:         res.data.uuid,
    username:     res.data.username,
    display_name: res.data.display_name,
    avatar:       res.data.avatar,
    country:      res.data.country,
    bio:          res.data.bio,
    created_at:   res.data.created_at,
  } as UserPublic;
}

export async function getUserQuestions({ uuid, page }: { uuid:string, page:number }) {
  const event = getRequestEvent();
  const { supabase } = event.locals;

  const res = await supabase.admin
    .from('questions')
    .select('*, author:users(*)', { count:'exact' })
    .eq('author', uuid)
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

export async function getUserAnswers({ uuid, page }: { uuid:string, page:number }) {
  const event = getRequestEvent();
  const { supabase } = event.locals;

  const res = await supabase.admin
    .from('answers')
    .select('*, author:users(*), question:questions(*, author:users(*))', { count:'exact' })
    .eq('author', uuid)
    .order('created_at', { ascending: false })
    .range((page - 1) * LATEST_QUESTIONS_LIMIT, (page * LATEST_QUESTIONS_LIMIT) - 1);

  if (res.error || !res.data)
    return { list:[], total: 0 };

  const list = res.data.map(a => ({
    uuid:        a.uuid,
    body:        a.body,
    score:       a.score,
    question:    a.question,
    is_solution: a.is_solution,
    author:      a.author,
    created_at:  a.created_at,
  } as AnswerDetailed));

  return {
    list,
    total: res.count ?? 0,
  }
}

export async function getUserVotes({ uuid, page }: { uuid:string, page:number }) {
  const event = getRequestEvent();
  const { supabase } = event.locals;

  const res = await supabase.admin
    .from('question_votes')
    .select('*, question:questions(*, author:users(*))', { count:'exact' })
    .eq('author', uuid)
    .order('created_at', { ascending: false })
    .range((page - 1) * LATEST_QUESTIONS_LIMIT, (page * LATEST_QUESTIONS_LIMIT) - 1);

  if (res.error || !res.data)
    return { list:[], total: 0 };

  const list = res.data.map(v => ({
    uuid:       v.uuid,
    sign:       v.sign ? 'up' : 'down',
    question:   v.question,
    author:     v.author,
    created_at: v.created_at,
  } as VoteDetailed));

  return {
    list,
    total: res.count ?? 0,
  }
}
