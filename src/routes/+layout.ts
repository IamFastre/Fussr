import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';

import type { Database } from '$/supabase/types';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
  depends('supabase:auth');

  // Defining either the server or browser clients accordingly
  const supabase = isBrowser()
    ? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      global: { fetch },
    })
    : createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      global:  { fetch },
      cookies: { getAll: () => data.cookies },
    });

  const [session, user] = await Promise.all([
    supabase.auth.getSession().then(s => s.data.session),
    supabase.auth.getUser().then(s => s.data.user),
  ]);

  return {
    user: user && user.id === data.user?.uuid ? data.user : null,
    auth: {
      isSigned: !!user,
      user:     user,
      session:  user ? session : null,
    }
  };
};
