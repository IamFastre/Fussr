--<< QUESTIONS >>---------------------------------------------------------------

CREATE TABLE public.questions (
  -- Properties --
  "uuid" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "tags" TEXT[6] NOT NULL,
  "user" UUID NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  -- Constrains --
  CONSTRAINT questions_user_fkey FOREIGN KEY ("user") REFERENCES public.users("uuid") ON UPDATE CASCADE ON DELETE CASCADE
);

--<< RLS >>---------------------------------------------------------------------

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Disallow all anons" ON public.questions AS PERMISSIVE FOR ALL TO ANON USING (FALSE) WITH CHECK (FALSE);

--<< Indexes >>-----------------------------------------------------------------

CREATE INDEX idx_questions_uuid ON public.questions ("uuid");
CREATE INDEX idx_questions_tags ON public.questions ("tags");
CREATE INDEX idx_questions_user ON public.questions ("user");

--------------------------------------------------------------------------------
