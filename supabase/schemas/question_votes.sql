--<< QUESTION_VOTES >>----------------------------------------------------------

CREATE TABLE public.question_votes (
  -- Properties --
  "uuid" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
  "question" UUID NOT NULL,
  "author" UUID NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  -- Constrains --
  CONSTRAINT question_votes_pkey PRIMARY KEY ("uuid"),
  CONSTRAINT question_votes_question_fkey FOREIGN KEY ("question") REFERENCES public.questions("uuid") ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT question_votes_author_fkey FOREIGN KEY ("author") REFERENCES public.users("uuid") ON UPDATE CASCADE ON DELETE CASCADE
);

--<< RLS >>---------------------------------------------------------------------

ALTER TABLE public.question_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Disallow all anons" ON public.question_votes AS PERMISSIVE FOR ALL TO ANON USING (FALSE) WITH CHECK (FALSE);

--<< Indexes >>-----------------------------------------------------------------

CREATE INDEX idx_question_votes_uuid ON public.question_votes ("uuid");
CREATE INDEX idx_question_votes_question ON public.question_votes ("question");
CREATE INDEX idx_question_votes_author ON public.question_votes ("author");

--------------------------------------------------------------------------------
