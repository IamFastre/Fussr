import type { Database } from '$/supabase/types';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

// See https://svelte.dev/docs/kit/types#app.d.ts

type AuthData = {
  isSigned: boolean;
  session:  Session | null;
  user:     User | null;
};

type Supabase = {
  anon:  SupabaseClient<Database>;
  admin: SupabaseClient<Database>;
};

declare global {
  namespace App {
    interface PageData {
      auth: AuthData;
		}

		interface Locals {
      auth: AuthData;
      supabase: Supabase;
    }

		// interface Error {}
    // interface PageState {}
    // interface Platform {}
  }
}

export { };

