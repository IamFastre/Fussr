import { success } from '$/server/api';
import { getUserByName } from '$/server/funcs/users';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const username = params.username;
  const data = await getUserByName(username);

  return success(data);
};
