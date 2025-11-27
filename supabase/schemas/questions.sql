--<< QUESTIONS >>---------------------------------------------------------------

CREATE TABLE public.questions (
  --- Properties ---
  "uuid" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "tags" TEXT[6] NOT NULL,
  "score" BIGINT NOT NULL DEFAULT 0,
  "answers" BIGINT NOT NULL DEFAULT 0,
  "follows" BIGINT NOT NULL DEFAULT 0,
  "author" UUID NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  --- Constrains ---
  CONSTRAINT questions_pkey PRIMARY KEY ("uuid"),
  CONSTRAINT questions_author_fkey FOREIGN KEY ("author") REFERENCES public.users("uuid") ON UPDATE CASCADE ON DELETE CASCADE
);

--<< RLS >>---------------------------------------------------------------------

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Disallow all anons" ON public.questions AS PERMISSIVE FOR ALL TO ANON USING (FALSE) WITH CHECK (FALSE);

--<< Indexes >>-----------------------------------------------------------------

CREATE INDEX idx_questions_uuid ON public.questions ("uuid");
CREATE INDEX idx_questions_tags ON public.questions ("tags");
CREATE INDEX idx_questions_author ON public.questions ("author");

--<< Trigger Functions >>-------------------------------------------------------

--- AFTER INSERT ---
CREATE OR REPLACE FUNCTION public.trg_fnc_questions_after_insert()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET SEARCH_PATH = public
AS $$
BEGIN
  INSERT INTO public.question_follows
    (question, "user")
  VALUES
    (NEW.uuid, NEW.author);

  RETURN NEW;
END;
$$;

--<< Triggers >>----------------------------------------------------------------

CREATE TRIGGER trg_questions_after_insert
  AFTER INSERT ON public.questions
FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_questions_after_insert();
