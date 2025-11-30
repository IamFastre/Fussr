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
    uuid:        res.data.uuid,
    body:        res.data.body,
    score:       res.data.score,
    question:    res.data.question,
    is_solution: res.data.is_solution,
    author:      res.data.author,
    created_at:  res.data.created_at,
  } satisfies AnswerPublic;
}

export async function voteAnswer({ answer, vote }: { answer:string, vote:'up' | 'down' | 'none' }) {
  const event = getRequestEvent();
  const { supabase, auth } = event.locals;

  if (!auth.user)
    return null;

  if (vote === 'none') {
    const res = await supabase.admin
      .from('answer_votes')
      .delete({ })
      .eq('author', auth.user.id)
      .eq('answer', answer)
      .select('uuid')
      .single();

    if (!res.data)
      return null;

    return res.data.uuid;
  }

  else {
    const res = await supabase.admin
      .from('answer_votes')
      .insert({ author:auth.user.id, answer, sign:vote === 'up' })
      .select('*')
      .single();

    if (!res.data)
      return null;

    return res.data.uuid;
  }
}

export async function deleteAnswer({ uuid }: { uuid:string }) {
  const event = getRequestEvent();
  const { supabase, auth } = event.locals;

  if (!auth.user)
    return null;

  const answer = await supabase.admin
    .from('answers')
    .delete({ })
    .eq('uuid', uuid)
    .eq('author', auth.user.id) // <- this makes sure the user actually owns the answer
    .select('uuid')
    .single();

  if (answer.error)
    return null;

  return answer.data.uuid;
}

export async function markSolution({ uuid }: { uuid:string }) {
  const event = getRequestEvent();
  const { supabase, auth } = event.locals;

  if (!auth.user)
    return null;

  const answer = await supabase.admin
    .from('answers')
    .select('*')
    .eq('uuid', uuid)
    .single();

  if (!answer.data)
    return null;

  const question = await supabase.admin
    .from('questions')
    .select('*')
    .eq('uuid', answer.data.question)
    .single();

  if (!question.data)
    return null;

  // If user requesting the answer to be marked is not OP, leave
  if (auth.user.id !== question.data.author)
    return null;

  // Reset previous solution
  await supabase.admin
    .from('answers')
    .update({ is_solution:false })
    .eq('question', question.data.uuid);

  const solution = await supabase.admin
    .from('answers')
    .update({ is_solution:true })
    .eq('uuid', uuid);

  if (solution.error)
    return null;

  return uuid;
}

export async function getQuestionAnswers({ question, page }: { question:string, page:number }) {
  const event = getRequestEvent();

  const { supabase, auth } = event.locals;

  const answers = await supabase.admin
    .from('answers')
    .select('*, author:users(*)', { count:'exact' })
    .eq('question', question)
    .order('is_solution', { ascending:false })
    .order('score', { ascending:false })
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
          .eq('author', auth.user?.id ?? '')
          .eq('answer', a.uuid)
          .maybeSingle()
      })
  );

  const list = answers.data.map((a, i) => ({
    uuid:        a.uuid,
    body:        a.body,
    score:       a.score,
    question:    a.question,
    vote:        !votes[i].data ? 'none' : votes[i].data.sign ? 'up' : 'down',
    is_solution: a.is_solution,
    author:      a.author,
    created_at:  a.created_at,
  } as AnswerPersonal));

  return {
    list,
    total: answers.count ?? 0,
  }
}
