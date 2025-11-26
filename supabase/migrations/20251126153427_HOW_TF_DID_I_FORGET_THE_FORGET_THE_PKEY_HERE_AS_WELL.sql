alter table "public"."users" drop constraint "users_uuid_key";

drop index if exists "public"."users_uuid_key";

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (uuid);

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";


