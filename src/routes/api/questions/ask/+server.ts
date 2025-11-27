import { error, success } from '$/server/api';
import { askQuestion } from '$/server/funcs/questions';
import type { Endpoints } from '$/utils/api';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const data = await askQuestion(body);

  if (!data)
    return error({ message:'Failed to ask question.' });

  return success<Endpoints['/questions/ask']['Return']>(data);
};
