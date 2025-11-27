import { notfound, success } from '$/server/api';
import { getUserByName } from '$/server/funcs/users';
import type { UserPublic } from '$/utils/types';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const username = params.username;
  const data = await getUserByName(username);

  if (!data)
    return notfound({ message:`User '${username}' not found.` });

  const user: UserPublic = {
    uuid:         data.uuid,
    username:     data.username,
    display_name: data.display_name,
    avatar:       data.avatar,
    country:      data.country,
    bio:          data.bio,
    created_at:   data.created_at,
  };

  return success(user);
};
