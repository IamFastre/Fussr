
create table "public"."users" (
  "uuid" uuid not null,
  "username" text not null,
  "created_at" timestamp with time zone not null default now()
);


alter table "public"."users" enable row level security;

CREATE INDEX idx_users_username ON public.users USING btree (username);

CREATE INDEX idx_users_uuid ON public.users USING btree (uuid);

CREATE UNIQUE INDEX users_username_unique ON public.users USING btree (username);

alter table "public"."users" add constraint "users_username_unique" UNIQUE using index "users_username_unique";

alter table "public"."users" add constraint "users_uuid_fkey" FOREIGN KEY (uuid) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_uuid_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.on_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
BEGIN
  INSERT INTO public.users
    ("uuid", "username")
  VALUES
    (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', NEW.id::text));
  RETURN NULL;
END
$function$
;

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";


  create policy "Disallow all anons"
  on "public"."users"
  as permissive
  for all
  to anon
using (false)
with check (false);


CREATE TRIGGER new_user AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.on_new_user();


