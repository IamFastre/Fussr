alter table "public"."questions" alter column "uuid" set default gen_random_uuid();

CREATE UNIQUE INDEX questions_pkey ON public.questions USING btree (uuid);

alter table "public"."questions" add constraint "questions_pkey" PRIMARY KEY using index "questions_pkey";


