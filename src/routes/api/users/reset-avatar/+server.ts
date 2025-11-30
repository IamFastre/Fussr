import { notfound, success } from '$/server/api';
import { resetAvatar } from '$/server/funcs/users';
import type { Endpoints } from '$/utils/api';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
  const data = await resetAvatar();

  if (!data)
    return notfound({ message:`Could not apply changes.` });

  return success<Endpoints['/users/reset-avatar']['Return']>("OK");
};
