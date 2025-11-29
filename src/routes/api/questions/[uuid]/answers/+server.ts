import { error, success } from '$/server/api';
import { getQuestionAnswers } from '$/server/funcs/answers';
import type { Endpoints } from '$/utils/api';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url }) => {
  const question = params.uuid;
  const page = Number(url.searchParams.get('page') ?? 1);

  const data = await getQuestionAnswers({ question, page });

  if (!data)
    return error({ message:'Failed to fetch latest question.' });

  return success<Endpoints['/questions/[uuid]/answers']['Return']>(data);
};
