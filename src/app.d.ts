import type { Database } from '$/supabase/types';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

// See https://svelte.dev/docs/kit/types#app.d.ts

declare global {
  namespace App {
    interface PageData {
			session: Session | null;
		}

		interface Locals {
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
      session: Session | null;
      user: User | null;
      supabase: {
        anon: SupabaseClient<Database>;
        admin: SupabaseClient<Database>;
      };
    }

		// interface Error {}
    // interface PageState {}
    // interface Platform {}
  }
}

export { };

