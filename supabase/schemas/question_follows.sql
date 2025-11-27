--<< QUESTION_FOLLOWS >>--------------------------------------------------------

CREATE TABLE public.question_follows (
  -- Properties --
  "uuid" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
  "question" UUID NOT NULL,
  "user" UUID NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  -- Constrains --
  CONSTRAINT question_follows_pkey PRIMARY KEY ("uuid"),
  CONSTRAINT question_follows_question_fkey FOREIGN KEY ("question") REFERENCES public.questions("uuid") ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT question_follows_user_fkey FOREIGN KEY ("user") REFERENCES public.users("uuid") ON UPDATE CASCADE ON DELETE CASCADE
);

--<< RLS >>---------------------------------------------------------------------

ALTER TABLE public.question_follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Disallow all anons" ON public.question_follows AS PERMISSIVE FOR ALL TO ANON USING (FALSE) WITH CHECK (FALSE);

--<< Indexes >>-----------------------------------------------------------------

CREATE INDEX idx_question_follows_uuid ON public.question_follows ("uuid");
CREATE INDEX idx_question_follows_question ON public.question_follows ("question");
CREATE INDEX idx_question_follows_user ON public.question_follows ("user");

--------------------------------------------------------------------------------
