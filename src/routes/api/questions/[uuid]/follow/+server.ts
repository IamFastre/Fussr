import { error, success } from '$/server/api';
import { followQuestion } from '$/server/funcs/questions';
import type { Endpoints } from '$/utils/api';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params }) => {
  const voteRes = await followQuestion(params.uuid);

  if (!voteRes)
    return error({ message:`Could not follow question: ${params.uuid}.` });

  return success<Endpoints['/questions/[uuid]/follow']['Return']>("OK");
};
