alter table "public"."users" drop constraint "users_username_unique";

drop trigger if exists "new_user" on "auth"."users";

drop function if exists "public"."on_new_user"();

drop index if exists "public"."idx_users_username";

drop index if exists "public"."users_username_unique";

alter table "public"."users" add column "avatar" text not null;

alter table "public"."users" add column "bio" text;

alter table "public"."users" add column "display_name" text;

CREATE UNIQUE INDEX idx_users_username_lower ON public.users USING btree (lower(username));

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

alter table "public"."users" add constraint "users_username_key" UNIQUE using index "users_username_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.on_new_auth_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
DECLARE
  uname TEXT;
BEGIN
  uname := NEW.raw_user_meta_data->>'username';

  INSERT INTO public.users
    ("uuid", "username", "avatar")
  VALUES
    (
      NEW.id,
      COALESCE(uname, NEW.id::TEXT),
      FORMAT('/api/users/%s/avatar', uname)
    );
  RETURN NULL;
END
$function$
;

CREATE TRIGGER new_auth_user AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.on_new_auth_user();


