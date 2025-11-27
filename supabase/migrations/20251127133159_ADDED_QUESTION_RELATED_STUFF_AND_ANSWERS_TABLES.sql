alter table "public"."questions" drop constraint "questions_user_fkey";

drop index if exists "public"."idx_questions_user";


  create table "public"."answer_votes" (
    "uuid" uuid not null default gen_random_uuid(),
    "answer" uuid not null,
    "author" uuid not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."answer_votes" enable row level security;


  create table "public"."answers" (
    "uuid" uuid not null default gen_random_uuid(),
    "question" uuid not null,
    "body" text not null,
    "score" bigint not null default 0,
    "author" uuid not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."answers" enable row level security;


  create table "public"."question_follows" (
    "uuid" uuid not null default gen_random_uuid(),
    "question" uuid not null,
    "user" uuid not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."question_follows" enable row level security;


  create table "public"."question_votes" (
    "uuid" uuid not null default gen_random_uuid(),
    "question" uuid not null,
    "author" uuid not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."question_votes" enable row level security;

alter table "public"."questions" drop column "user";

alter table "public"."questions" add column "answers" bigint not null default 0;

alter table "public"."questions" add column "author" uuid not null;

alter table "public"."questions" add column "follows" bigint not null default 0;

alter table "public"."questions" add column "score" bigint not null default 0;

CREATE UNIQUE INDEX answer_votes_pkey ON public.answer_votes USING btree (uuid);

CREATE UNIQUE INDEX answers_pkey ON public.answers USING btree (uuid);

CREATE INDEX idx_answer_votes_answer ON public.answer_votes USING btree (answer);

CREATE INDEX idx_answer_votes_author ON public.answer_votes USING btree (author);

CREATE INDEX idx_answer_votes_uuid ON public.answer_votes USING btree (uuid);

CREATE INDEX idx_answers_author ON public.answers USING btree (author);

CREATE INDEX idx_answers_question ON public.answers USING btree (question);

CREATE INDEX idx_answers_uuid ON public.answers USING btree (uuid);

CREATE INDEX idx_question_follows_question ON public.question_follows USING btree (question);

CREATE INDEX idx_question_follows_user ON public.question_follows USING btree ("user");

CREATE INDEX idx_question_follows_uuid ON public.question_follows USING btree (uuid);

CREATE INDEX idx_question_votes_author ON public.question_votes USING btree (author);

CREATE INDEX idx_question_votes_question ON public.question_votes USING btree (question);

CREATE INDEX idx_question_votes_uuid ON public.question_votes USING btree (uuid);

CREATE INDEX idx_questions_author ON public.questions USING btree (author);

CREATE UNIQUE INDEX question_follows_pkey ON public.question_follows USING btree (uuid);

CREATE UNIQUE INDEX question_votes_pkey ON public.question_votes USING btree (uuid);

alter table "public"."answer_votes" add constraint "answer_votes_pkey" PRIMARY KEY using index "answer_votes_pkey";

alter table "public"."answers" add constraint "answers_pkey" PRIMARY KEY using index "answers_pkey";

alter table "public"."question_follows" add constraint "question_follows_pkey" PRIMARY KEY using index "question_follows_pkey";

alter table "public"."question_votes" add constraint "question_votes_pkey" PRIMARY KEY using index "question_votes_pkey";

alter table "public"."answer_votes" add constraint "answer_votes_answer_fkey" FOREIGN KEY (answer) REFERENCES public.answers(uuid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."answer_votes" validate constraint "answer_votes_answer_fkey";

alter table "public"."answer_votes" add constraint "answer_votes_author_fkey" FOREIGN KEY (author) REFERENCES public.users(uuid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."answer_votes" validate constraint "answer_votes_author_fkey";

alter table "public"."answers" add constraint "answers_author_fkey" FOREIGN KEY (author) REFERENCES public.users(uuid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."answers" validate constraint "answers_author_fkey";

alter table "public"."answers" add constraint "answers_question_fkey" FOREIGN KEY (question) REFERENCES public.questions(uuid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."answers" validate constraint "answers_question_fkey";

alter table "public"."question_follows" add constraint "question_follows_question_fkey" FOREIGN KEY (question) REFERENCES public.questions(uuid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."question_follows" validate constraint "question_follows_question_fkey";

alter table "public"."question_follows" add constraint "question_follows_user_fkey" FOREIGN KEY ("user") REFERENCES public.users(uuid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."question_follows" validate constraint "question_follows_user_fkey";

alter table "public"."question_votes" add constraint "question_votes_author_fkey" FOREIGN KEY (author) REFERENCES public.users(uuid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."question_votes" validate constraint "question_votes_author_fkey";

alter table "public"."question_votes" add constraint "question_votes_question_fkey" FOREIGN KEY (question) REFERENCES public.questions(uuid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."question_votes" validate constraint "question_votes_question_fkey";

alter table "public"."questions" add constraint "questions_author_fkey" FOREIGN KEY (author) REFERENCES public.users(uuid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."questions" validate constraint "questions_author_fkey";

grant delete on table "public"."answer_votes" to "anon";

grant insert on table "public"."answer_votes" to "anon";

grant references on table "public"."answer_votes" to "anon";

grant select on table "public"."answer_votes" to "anon";

grant trigger on table "public"."answer_votes" to "anon";

grant truncate on table "public"."answer_votes" to "anon";

grant update on table "public"."answer_votes" to "anon";

grant delete on table "public"."answer_votes" to "authenticated";

grant insert on table "public"."answer_votes" to "authenticated";

grant references on table "public"."answer_votes" to "authenticated";

grant select on table "public"."answer_votes" to "authenticated";

grant trigger on table "public"."answer_votes" to "authenticated";

grant truncate on table "public"."answer_votes" to "authenticated";

grant update on table "public"."answer_votes" to "authenticated";

grant delete on table "public"."answer_votes" to "service_role";

grant insert on table "public"."answer_votes" to "service_role";

grant references on table "public"."answer_votes" to "service_role";

grant select on table "public"."answer_votes" to "service_role";

grant trigger on table "public"."answer_votes" to "service_role";

grant truncate on table "public"."answer_votes" to "service_role";

grant update on table "public"."answer_votes" to "service_role";

grant delete on table "public"."answers" to "anon";

grant insert on table "public"."answers" to "anon";

grant references on table "public"."answers" to "anon";

grant select on table "public"."answers" to "anon";

grant trigger on table "public"."answers" to "anon";

grant truncate on table "public"."answers" to "anon";

grant update on table "public"."answers" to "anon";

grant delete on table "public"."answers" to "authenticated";

grant insert on table "public"."answers" to "authenticated";

grant references on table "public"."answers" to "authenticated";

grant select on table "public"."answers" to "authenticated";

grant trigger on table "public"."answers" to "authenticated";

grant truncate on table "public"."answers" to "authenticated";

grant update on table "public"."answers" to "authenticated";

grant delete on table "public"."answers" to "service_role";

grant insert on table "public"."answers" to "service_role";

grant references on table "public"."answers" to "service_role";

grant select on table "public"."answers" to "service_role";

grant trigger on table "public"."answers" to "service_role";

grant truncate on table "public"."answers" to "service_role";

grant update on table "public"."answers" to "service_role";

grant delete on table "public"."question_follows" to "anon";

grant insert on table "public"."question_follows" to "anon";

grant references on table "public"."question_follows" to "anon";

grant select on table "public"."question_follows" to "anon";

grant trigger on table "public"."question_follows" to "anon";

grant truncate on table "public"."question_follows" to "anon";

grant update on table "public"."question_follows" to "anon";

grant delete on table "public"."question_follows" to "authenticated";

grant insert on table "public"."question_follows" to "authenticated";

grant references on table "public"."question_follows" to "authenticated";

grant select on table "public"."question_follows" to "authenticated";

grant trigger on table "public"."question_follows" to "authenticated";

grant truncate on table "public"."question_follows" to "authenticated";

grant update on table "public"."question_follows" to "authenticated";

grant delete on table "public"."question_follows" to "service_role";

grant insert on table "public"."question_follows" to "service_role";

grant references on table "public"."question_follows" to "service_role";

grant select on table "public"."question_follows" to "service_role";

grant trigger on table "public"."question_follows" to "service_role";

grant truncate on table "public"."question_follows" to "service_role";

grant update on table "public"."question_follows" to "service_role";

grant delete on table "public"."question_votes" to "anon";

grant insert on table "public"."question_votes" to "anon";

grant references on table "public"."question_votes" to "anon";

grant select on table "public"."question_votes" to "anon";

grant trigger on table "public"."question_votes" to "anon";

grant truncate on table "public"."question_votes" to "anon";

grant update on table "public"."question_votes" to "anon";

grant delete on table "public"."question_votes" to "authenticated";

grant insert on table "public"."question_votes" to "authenticated";

grant references on table "public"."question_votes" to "authenticated";

grant select on table "public"."question_votes" to "authenticated";

grant trigger on table "public"."question_votes" to "authenticated";

grant truncate on table "public"."question_votes" to "authenticated";

grant update on table "public"."question_votes" to "authenticated";

grant delete on table "public"."question_votes" to "service_role";

grant insert on table "public"."question_votes" to "service_role";

grant references on table "public"."question_votes" to "service_role";

grant select on table "public"."question_votes" to "service_role";

grant trigger on table "public"."question_votes" to "service_role";

grant truncate on table "public"."question_votes" to "service_role";

grant update on table "public"."question_votes" to "service_role";


  create policy "Disallow all anons"
  on "public"."answer_votes"
  as permissive
  for all
  to anon
using (false)
with check (false);



  create policy "Disallow all anons"
  on "public"."answers"
  as permissive
  for all
  to anon
using (false)
with check (false);



  create policy "Disallow all anons"
  on "public"."question_follows"
  as permissive
  for all
  to anon
using (false)
with check (false);



  create policy "Disallow all anons"
  on "public"."question_votes"
  as permissive
  for all
  to anon
using (false)
with check (false);



