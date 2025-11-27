import { error, success } from '$/server/api';
import { getQuestionsLatest } from '$/server/funcs/questions';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const data = await getQuestionsLatest();

  if (!data)
    return error({ message:'Failed to fetch latest question.' });
  return success(data);
};
