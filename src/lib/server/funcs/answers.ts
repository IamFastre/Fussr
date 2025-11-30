import { LATEST_ANSWERS_LIMIT } from "$/utils";
import type { AnswerPersonal, AnswerPublic } from "$/utils/types";
import { AnswerForm } from "$/utils/zod/forms";
import { getRequestEvent } from "$app/server";


export async function answerQuestion(answer: AnswerForm) {
  const event = getRequestEvent();

  const { supabase, auth } = event.locals;
  const { success, data } = AnswerForm.safeParse(answer);

  if (!success || !auth.user)
    return null;

  const res = await supabase.admin
    .from('answers')
    .insert({ body: data.body, question: data.question, author: auth.user.id })
    .select('*, author:users(*)')
    .single();

  if (!res.data)
    return null;

  return {
    uuid: res.data.uuid,
    body: res.data.body,
    question: res.data.question,
    author: res.data.author,
    score: res.data.score,
    created_at: res.data.created_at,
  } satisfies AnswerPublic;
}

export async function getQuestionAnswers({ question, page }: { question:string, page:number }) {
  const event = getRequestEvent();

  const { supabase, auth } = event.locals;

  const answers = await supabase.admin
    .from('answers')
    .select('*, author:users(*)', { count:'exact' })
    .eq('question', question)
    .order('created_at', { ascending: false })
    .range((page - 1) * LATEST_ANSWERS_LIMIT, (page * LATEST_ANSWERS_LIMIT) - 1);

  if (answers.error || !answers.data)
    return { list:[], total: 0 };

  const votes = await Promise.all(
    answers.data
      .map(a => {
        return supabase.admin
          .from('answer_votes')
          .select('*')
          .eq('user', auth.user?.id ?? '')
          .eq('answer', a.uuid)
          .single()
      })
  );

  const list = answers.data.map((a, i) => ({
    uuid:       a.uuid,
    body:       a.body,
    score:      a.score,
    question:   a.question,
    vote:       !votes[i].data ? 'none' : votes[i].data.sign ? 'up' : 'down',
    author:     a.author,
    created_at: a.created_at,
  } as AnswerPersonal));

  return {
    list,
    total: answers.count ?? 0,
  }
}
