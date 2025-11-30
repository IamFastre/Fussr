import { error, success } from '$/server/api';
import { voteAnswer } from '$/server/funcs/answers';
import type { Endpoints } from '$/utils/api';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, params }) => {
  const body = await request.json();

  const voteRes = await voteAnswer({
    answer: params.uuid,
    vote: body.vote,
  });

  if (!voteRes)
    return error({ message:`Could not cast vote on answer: ${params.uuid}.` });

  return success<Endpoints['/answers/[uuid]/vote']['Return']>("OK");
};
