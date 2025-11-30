import { error, success } from '$/server/api';
import { markSolution } from '$/server/funcs/answers';
import type { Endpoints } from '$/utils/api';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, params }) => {
  const markRes = await markSolution({ uuid: params.uuid });

  if (!markRes)
    return error({ message:`Could not mark answer as solution: ${params.uuid}.` });

  return success<Endpoints['/answers/[uuid]/mark-solution']['Return']>("OK");
};
