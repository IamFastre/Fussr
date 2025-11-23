import { badquery, success } from '$/server/api';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals:{ supabase } }) => {
  const auth = await supabase.anon.auth.signOut();

  if (auth.error)
    return badquery(auth.error);
  return success("OK");
};
