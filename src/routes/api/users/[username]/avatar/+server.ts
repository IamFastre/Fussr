
import { notfound } from '$/server/api';
import { getUserByName } from '$/server/funcs/users';
import { DICEBEAR_BACKGROUND_COLORS, DICEBEAR_SHAPE_COLORS, DICEBEAR_THUMBS_API } from '$/utils';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, params, locals:{ supabase } }) => {
  const username = params.username.toLowerCase();
  const user = await getUserByName(username);

  if (!user)
    return notfound({ message:"User does not exist" });

  const avatarUrl = supabase.admin.storage
    .from('avatars')
    .getPublicUrl(`${user.uuid}.png`).data.publicUrl

  const dicebearUrl = new URL(DICEBEAR_THUMBS_API);

  dicebearUrl.searchParams.set('seed',                                        username);
  dicebearUrl.searchParams.set('shape1Color',          DICEBEAR_SHAPE_COLORS.join(','));
  dicebearUrl.searchParams.set('shape2Color',          DICEBEAR_SHAPE_COLORS.join(','));
  dicebearUrl.searchParams.set('shape3Color',          DICEBEAR_SHAPE_COLORS.join(','));
  dicebearUrl.searchParams.set('backgroundColor', DICEBEAR_BACKGROUND_COLORS.join(','));
  dicebearUrl.searchParams.set('size',                                           '256');
  dicebearUrl.searchParams.set('scale',                                           '90');

  const headers = new Headers({
    'Content-Type': 'image/png',
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache',
    'Expires': '0',
  });

  const storageRes = await fetch(avatarUrl, { headers: request.headers });

  if (storageRes.ok) {
    Object.defineProperty(storageRes, 'headers', { value:headers })
    return storageRes;
  }

  const dicebearRes = await fetch(dicebearUrl, { headers: request.headers });


  Object.defineProperty(dicebearRes, 'headers', { value:headers })
  return dicebearRes;
};
