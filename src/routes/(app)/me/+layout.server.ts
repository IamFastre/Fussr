import { getUserByUUID } from '$/server/funcs/users';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals:{ auth } }) => {
  const user = await getUserByUUID(auth.user?.id ?? '');

  if (!user)
    redirect(303, '/auth');

  return { user };
};
