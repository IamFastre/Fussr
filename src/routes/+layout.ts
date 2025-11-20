import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';

import type { Database } from '$/supabase/types';
import type { LayoutLoad } from './$types';

export const load:LayoutLoad = async ({ data, depends, fetch }) => {
  depends('supabase:auth');

  // Defining both the server and browser clients accordingly
  const supabase = isBrowser()
    ? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      global: { fetch },
    })
    : createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      global:  { fetch },
      cookies: { getAll: () => data.cookies },
    });

  const { data:{ session } } = await supabase.auth.getSession();

  return {
    supabase,
    session,
  };
};
