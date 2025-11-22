import { type EmailOtpType } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const token_hash = url.searchParams.get('token_hash') as string;
  const type = url.searchParams.get('type') as EmailOtpType | null;

  const redirectTo = new URL(url);

  redirectTo.pathname = "/me";
  redirectTo.searchParams.delete('token_hash');
  redirectTo.searchParams.delete('type');

  if (token_hash && type) {
    const { error } = await supabase.anon.auth.verifyOtp({ token_hash, type });

    if (!error) {
      redirectTo.searchParams.delete('next');
      redirect(303, redirectTo);
    }
  }

  redirectTo.pathname = '/auth/error';
  redirect(303, redirectTo);
}
