import { error, success } from '$/server/api';
import { getUserAnswers, getUserByName } from '$/server/funcs/users';
import type { Endpoints } from '$/utils/api';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url }) => {
  const user = await getUserByName(params.username);
  const uuid = user?.uuid;
  const page = Number(url.searchParams.get('page') ?? 1);

  if (!uuid)
    return error({ message:'User not found.' });

  const data = await getUserAnswers({ uuid, page });

  if (!data)
    return error({ message:"Failed to fetch user's answers." });

  return success<Endpoints['/users/[username]/answers']['Return']>(data);
};
