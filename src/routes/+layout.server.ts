import { getUserByUUID } from '$/server/funcs/users';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, locals:{ auth } }) => {
  const user = auth.user ? await getUserByUUID(auth.user.id) : null;

  return { user, auth, cookies: cookies.getAll() };
};
