import { error, success } from '$/server/api';
import { voteQuestion } from '$/server/funcs/questions';
import type { Endpoints } from '$/utils/api';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, params }) => {
  const body = await request.json();

  const voteRes = await voteQuestion({
    question: params.uuid,
    vote: body.vote,
  });

  if (!voteRes)
    return error({ message:`Could not cast vote on question: ${params.uuid}.` });

  return success<Endpoints['/questions/[uuid]/vote']['Return']>("OK");
};
