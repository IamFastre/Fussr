import { error, success } from '$/server/api';
import { askQuestion } from '$/server/funcs/questions';
import type { QuestionPublic } from '$/utils/types';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const data = await askQuestion(body);

  if (!data)
    return error({ message:'Failed to ask question.' });

  const question: QuestionPublic = {
    uuid:       data.uuid,
    title:      data.title,
    body:       data.body,
    tags:       data.tags,
    user:       data.user,
    created_at: data.created_at,
  }

  return success(question);
};
