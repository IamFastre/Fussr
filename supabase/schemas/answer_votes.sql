--<< ANSWER_VOTES >>------------------------------------------------------------

CREATE TABLE public.answer_votes (
  -- Properties --
  "uuid" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
  "answer" UUID NOT NULL,
  "author" UUID NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  -- Constrains --
  CONSTRAINT answer_votes_pkey PRIMARY KEY ("uuid"),
  CONSTRAINT answer_votes_answer_fkey FOREIGN KEY ("answer") REFERENCES public.answers("uuid") ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT answer_votes_author_fkey FOREIGN KEY ("author") REFERENCES public.users("uuid") ON UPDATE CASCADE ON DELETE CASCADE
);

--<< RLS >>---------------------------------------------------------------------

ALTER TABLE public.answer_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Disallow all anons" ON public.answer_votes AS PERMISSIVE FOR ALL TO ANON USING (FALSE) WITH CHECK (FALSE);

--<< Indexes >>-----------------------------------------------------------------

CREATE INDEX idx_answer_votes_uuid ON public.answer_votes ("uuid");
CREATE INDEX idx_answer_votes_answer ON public.answer_votes ("answer");
CREATE INDEX idx_answer_votes_author ON public.answer_votes ("author");

--------------------------------------------------------------------------------
