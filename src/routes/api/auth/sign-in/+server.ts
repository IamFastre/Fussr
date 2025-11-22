import { badparse, badquery, success } from '$/server/api';
import { SignInForm } from '$/utils/zod/forms';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals:{ supabase } }) => {
  const body = await request.json();

  const input = SignInForm.safeParse(body);

  if (!input.success)
    return badparse(input.error);

  const auth = await supabase.anon.auth.signInWithPassword({
    email: input.data.email,
    password: input.data.password,
  });

  if (auth.error)
    return badquery(auth.error);

  return success("OK");
};
