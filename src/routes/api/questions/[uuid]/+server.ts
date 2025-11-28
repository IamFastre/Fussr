import { notfound, success } from '$/server/api';
import { getQuestionByUUID } from '$/server/funcs/questions';
import type { Endpoints } from '$/utils/api';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const uuid = params.uuid;
  const data = await getQuestionByUUID(uuid);

  if (!data)
    return notfound({ message:`User '${uuid}' not found.` });

  return success<Endpoints['/questions/[uuid]']['Return']>(data);
};
