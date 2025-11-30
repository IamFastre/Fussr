import { notfound, success } from '$/server/api';
import { editUser } from '$/server/funcs/users';
import type { Endpoints } from '$/utils/api';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const data = await editUser(body);

  if (!data)
    return notfound({ message:`Could not apply changes.` });

  return success<Endpoints['/users/edit']['Return']>("OK");
};
