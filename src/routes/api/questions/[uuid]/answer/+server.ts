import { error, success } from '$/server/api';
import { answerQuestion } from "$/server/funcs/answers";
import type { Endpoints } from '$/utils/api';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, params }) => {
  const question = params.uuid;
  const body = await request.json();

  const answer = await answerQuestion({ body:body.body, question });

  if (!answer)
    return error({ message:`Could not answer question: ${question}.` });

  return success<Endpoints['/questions/[uuid]/answer']['Return']>(answer);
};
