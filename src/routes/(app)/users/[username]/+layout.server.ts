import { getUserByName } from '$/server/funcs/users';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
  const user = await getUserByName(params.username);
  return { user };
};
