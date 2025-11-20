import { createServerClient as createAnonClient } from '@supabase/ssr';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { PRIVATE_SUPABASE_ADMIN_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

// Directories that will not need auth and won't redirect to login
const AUTHLESS_DIRECTORIES = [
  '/',
  '/about',
  '/auth/?.*',

  '/api/auth/?.*',
  '/api/other/ping',
];

const isAuthless = (dir: string) => {
  return AUTHLESS_DIRECTORIES.some(authless => {
    const reg = new RegExp(`^${authless}$`);
    return reg.test(dir);
  });
};

const supabase: Handle = async ({ event, resolve }) => {
  // Creates a Supabase client specific to this server request.
  event.locals.supabase = { } as typeof event.locals.supabase;

  // Setting up the anon client //
  event.locals.supabase.anon = createAnonClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/', secure: false });
        });
      }
    }
  });

  // Setting up the admin client //
  event.locals.supabase.admin = createAdminClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_ADMIN_KEY, {
    // Making sure it doesn't consider the server a user
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Suppress the annoying warning for `getSession`, I have no hand in this.
  event.locals.supabase.anon.auth['suppressGetSessionWarning'] = true;

  // Since user can logout, you wanna make sure he's sill signed in.
  event.locals.safeGetSession = async () => {
    const { data: { session } } = await event.locals.supabase.anon.auth.getSession();

    if (!session)
      return { session: null, user: null };

    const { data: { user }, error } = await event.locals.supabase.anon.auth.getUser();

    // Nullify the user if JWT validation fails
    if (error)
      return { session: null, user: null };

    return { session, user };
  };

  return resolve(event, {
    // Pass `content-range` and `x-supabase-api-version` to Supabase.
    filterSerializedResponseHeaders: name => {
      return name === 'content-range' || name === 'x-supabase-api-version';
    }
  });
};

const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession();

  event.locals.session = session;
  event.locals.user    = user;

  // Suppress the `.well-known` shit.
  // No, Chrome, it's not well-known.
  if (event.url.pathname.startsWith( '/.well-known/appspecific'))
    return new Response(null, { status: 204 });

  const hasSession   = !!event.locals.session;
  const requiresAuth = !isAuthless(event.url.pathname);

  // If the user has no Supabase session (i.e logged in)
  // And the directory requires auth,
  // redirect them to the auth page
  if (!hasSession && requiresAuth)
    redirect(303, '/auth');

  return resolve(event);
};

export const handle:Handle = sequence(supabase, authGuard);
