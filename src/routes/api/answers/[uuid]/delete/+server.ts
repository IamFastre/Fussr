import { error, success } from '$/server/api';
import { deleteAnswer } from '$/server/funcs/answers';
import type { Endpoints } from '$/utils/api';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params }) => {
  const uuid = params.uuid;
  const delRes = await deleteAnswer({ uuid });

  if (!delRes)
    return error({ message:`Could not delete answer: ${params.uuid}.` });

  return success<Endpoints['/answers/[uuid]/delete']['Return']>("OK");
};
