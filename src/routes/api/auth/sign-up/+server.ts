import { badparse, badquery, success } from '$/server/api';
import type { Endpoints } from '$/utils/api';
import { SignUpForm } from '$/utils/zod/forms';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ url, request, locals:{ supabase } }) => {
  const body = await request.json();
  const input = SignUpForm.safeParse(body);

  if (!input.success)
    return badparse(input.error);

  const auth = await supabase.anon.auth.signUp({
    email: input.data.email,
    password: input.data.password,
    options: {
      data:{ username:input.data.username },
      emailRedirectTo: url.origin + '/auth/confirm'
    }
  });

  if (auth.error)
    return badquery(auth.error);

  return success<Endpoints['/auth/sign-up']['Return']>("OK");
};
