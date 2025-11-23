import { badparse, badquery, success } from '$/server/api';
import { RecoveryForm } from '$/utils/zod/forms';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ url, request, locals:{ supabase } }) => {
  const body = await request.json();

  const input = RecoveryForm.safeParse(body);

  if (!input.success)
    return badparse(input.error);

  const auth = await supabase.anon.auth.resetPasswordForEmail(input.data.email, {
    redirectTo: url.origin + '/auth/confirm'
  });

  if (auth.error)
    return badquery(auth.error);
  return success("OK");
};
