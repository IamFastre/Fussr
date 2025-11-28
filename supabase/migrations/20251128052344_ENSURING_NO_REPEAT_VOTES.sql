CREATE UNIQUE INDEX answer_votes_author_answer_unique ON public.answer_votes USING btree (author, answer);

CREATE UNIQUE INDEX question_follows_user_question_unique ON public.question_follows USING btree ("user", question);

CREATE UNIQUE INDEX question_votes_author_question_unique ON public.question_votes USING btree (author, question);

alter table "public"."answer_votes" add constraint "answer_votes_author_answer_unique" UNIQUE using index "answer_votes_author_answer_unique";

alter table "public"."question_follows" add constraint "question_follows_user_question_unique" UNIQUE using index "question_follows_user_question_unique";

alter table "public"."question_votes" add constraint "question_votes_author_question_unique" UNIQUE using index "question_votes_author_question_unique";


