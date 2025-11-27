import { notfound, success } from '$/server/api';
import { getUserByName } from '$/server/funcs/users';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const username = params.username;
  const data = await getUserByName(username);

  if (!data)
    return notfound({ message:`User '${username}' not found.` });
  return success(data);
};
