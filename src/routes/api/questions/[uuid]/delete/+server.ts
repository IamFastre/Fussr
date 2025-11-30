import { error, success } from '$/server/api';
import { deleteQuestion } from '$/server/funcs/questions';
import type { Endpoints } from '$/utils/api';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params }) => {
  const uuid = params.uuid;
  const delRes = await deleteQuestion({ uuid });

  if (!delRes)
    return error({ message:`Could not delete question: ${params.uuid}.` });

  return success<Endpoints['/questions/[uuid]/delete']['Return']>("OK");
};
