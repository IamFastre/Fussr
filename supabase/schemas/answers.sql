--<< ANSWERS >>-----------------------------------------------------------------

CREATE TABLE public.answers (
  -- Properties --
  "uuid" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
  "question" UUID NOT NULL,
  "body" TEXT NOT NULL,
  "score" BIGINT NOT NULL DEFAULT 0,
  "author" UUID NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  -- Constrains --
  CONSTRAINT answers_pkey PRIMARY KEY ("uuid"),
  CONSTRAINT answers_question_fkey FOREIGN KEY ("question") REFERENCES public.questions("uuid") ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT answers_author_fkey FOREIGN KEY ("author") REFERENCES public.users("uuid") ON UPDATE CASCADE ON DELETE CASCADE
);

--<< RLS >>---------------------------------------------------------------------

ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Disallow all anons" ON public.answers AS PERMISSIVE FOR ALL TO ANON USING (FALSE) WITH CHECK (FALSE);

--<< Indexes >>-----------------------------------------------------------------

CREATE INDEX idx_answers_uuid ON public.answers ("uuid");
CREATE INDEX idx_answers_question ON public.answers ("question");
CREATE INDEX idx_answers_author ON public.answers ("author");

--------------------------------------------------------------------------------
