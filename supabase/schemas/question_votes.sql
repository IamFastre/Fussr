--<< QUESTION_VOTES >>----------------------------------------------------------

CREATE TABLE public.question_votes (
  --- Properties ---
  "uuid" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
  "sign" BOOLEAN NOT NULL DEFAULT TRUE,
  "question" UUID NOT NULL,
  "author" UUID NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  --- Constrains ---
  CONSTRAINT question_votes_pkey PRIMARY KEY ("uuid"),
  CONSTRAINT question_votes_question_fkey FOREIGN KEY ("question") REFERENCES public.questions("uuid") ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT question_votes_author_fkey FOREIGN KEY ("author") REFERENCES public.users("uuid") ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT question_votes_author_question_unique UNIQUE ("author", "question")
);

--<< RLS >>---------------------------------------------------------------------

ALTER TABLE public.question_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Disallow all anons" ON public.question_votes AS PERMISSIVE FOR ALL TO ANON USING (FALSE) WITH CHECK (FALSE);

--<< Indexes >>-----------------------------------------------------------------

CREATE INDEX idx_question_votes_uuid ON public.question_votes ("uuid");
CREATE INDEX idx_question_votes_question ON public.question_votes ("question");
CREATE INDEX idx_question_votes_author ON public.question_votes ("author");

--<< Trigger Functions >>-------------------------------------------------------

--- BEFORE UPDATE ---
CREATE OR REPLACE FUNCTION public.trg_fnc_question_votes_before_update()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET SEARCH_PATH = public
AS $$
BEGIN
  -- Disallow updates, a true man deletes and reinserts
  RAISE EXCEPTION 'Updating question votes is not allowed' USING ERRCODE = 'operation_not_supported';
  RETURN NULL;
END;
$$;

--- AFTER INSERT ---
CREATE OR REPLACE FUNCTION public.trg_fnc_question_votes_after_insert()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET SEARCH_PATH = public
AS $$
BEGIN
  -- Set question score
  UPDATE public.questions SET
    score = score + (CASE WHEN NEW.sign THEN +1 ELSE -1 END)
  WHERE uuid = NEW.question;

  RETURN NEW;
END;
$$;

--- AFTER DELETE ---
CREATE OR REPLACE FUNCTION public.trg_fnc_question_votes_after_delete()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET SEARCH_PATH = public
AS $$
BEGIN
  -- Set question score
  UPDATE public.questions SET
    score = score - (CASE WHEN OLD.sign THEN +1 ELSE -1 END)
  WHERE uuid = OLD.question;

  RETURN OLD;
END;
$$;

--<< Triggers >>----------------------------------------------------------------

CREATE TRIGGER trg_question_votes_before_update
  BEFORE UPDATE ON public.question_votes
FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_question_votes_before_update();

CREATE TRIGGER trg_question_votes_after_insert
  AFTER INSERT ON public.question_votes
FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_question_votes_after_insert();

CREATE TRIGGER trg_question_votes_after_delete
  AFTER DELETE ON public.question_votes
FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_question_votes_after_delete();
