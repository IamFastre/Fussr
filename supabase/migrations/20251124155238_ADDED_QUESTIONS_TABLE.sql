
  create table "public"."questions" (
    "uuid" uuid not null,
    "title" text not null,
    "body" text not null,
    "tags" text[] not null,
    "user" uuid not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."questions" enable row level security;

CREATE INDEX idx_questions_tags ON public.questions USING btree (tags);

CREATE INDEX idx_questions_user ON public.questions USING btree ("user");

CREATE INDEX idx_questions_uuid ON public.questions USING btree (uuid);

CREATE UNIQUE INDEX users_uuid_key ON public.users USING btree (uuid);

alter table "public"."questions" add constraint "questions_user_fkey" FOREIGN KEY ("user") REFERENCES public.users(uuid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."questions" validate constraint "questions_user_fkey";

alter table "public"."users" add constraint "users_uuid_key" UNIQUE using index "users_uuid_key";

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

grant delete on table "public"."questions" to "anon";

grant insert on table "public"."questions" to "anon";

grant references on table "public"."questions" to "anon";

grant select on table "public"."questions" to "anon";

grant trigger on table "public"."questions" to "anon";

grant truncate on table "public"."questions" to "anon";

grant update on table "public"."questions" to "anon";

grant delete on table "public"."questions" to "authenticated";

grant insert on table "public"."questions" to "authenticated";

grant references on table "public"."questions" to "authenticated";

grant select on table "public"."questions" to "authenticated";

grant trigger on table "public"."questions" to "authenticated";

grant truncate on table "public"."questions" to "authenticated";

grant update on table "public"."questions" to "authenticated";

grant delete on table "public"."questions" to "service_role";

grant insert on table "public"."questions" to "service_role";

grant references on table "public"."questions" to "service_role";

grant select on table "public"."questions" to "service_role";

grant trigger on table "public"."questions" to "service_role";

grant truncate on table "public"."questions" to "service_role";

grant update on table "public"."questions" to "service_role";


  create policy "Disallow all anons"
  on "public"."questions"
  as permissive
  for all
  to anon
using (false)
with check (false);



