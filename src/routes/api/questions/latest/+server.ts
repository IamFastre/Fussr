import { error, success } from '$/server/api';
import { getQuestionsLatest } from '$/server/funcs/questions';
import type { Endpoints } from '$/utils/api';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const page = Number(url.searchParams.get('page')) ?? 1;
  const data = await getQuestionsLatest({ page });

  if (!data)
    return error({ message:'Failed to fetch latest question.' });

  return success<Endpoints['/questions/latest']['Return']>(data);
};
