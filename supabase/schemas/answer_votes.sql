--<< ANSWER_VOTES >>------------------------------------------------------------

CREATE TABLE public.answer_votes (
  --- Properties ---
  "uuid" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
  "sign" boolean NOT NULL DEFAULT TRUE,
  "answer" UUID NOT NULL,
  "author" UUID NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  --- Constrains ---
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

--<< Trigger Functions >>-------------------------------------------------------

--- BEFORE UPDATE ---
CREATE OR REPLACE FUNCTION public.trg_fnc_answer_votes_before_update()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET SEARCH_PATH = public
AS $$
BEGIN
  -- Disallow updates, a true man deletes and reinserts
  RAISE EXCEPTION 'Updating answer votes is not allowed' USING ERRCODE = 'operation_not_supported';
  RETURN NULL;
END;
$$;

--- AFTER INSERT ---
CREATE OR REPLACE FUNCTION public.trg_fnc_answer_votes_after_insert()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET SEARCH_PATH = public
AS $$
BEGIN
  -- Set answer score
  UPDATE public.answers SET
    score = score + (CASE WHEN NEW.sign THEN +1 ELSE -1 END)
  WHERE uuid = NEW.answer;

  RETURN NEW;
END;
$$;

--- AFTER DELETE ---
CREATE OR REPLACE FUNCTION public.trg_fnc_answer_votes_after_delete()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET SEARCH_PATH = public
AS $$
BEGIN
  -- Set answer score
  UPDATE public.answers SET
    score = score - (CASE WHEN OLD.sign THEN +1 ELSE -1 END)
  WHERE uuid = OLD.answer;

  RETURN OLD;
END;
$$;

--<< Triggers >>----------------------------------------------------------------

CREATE TRIGGER trg_answer_votes_before_update
  BEFORE UPDATE ON public.answer_votes
FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_answer_votes_before_update();

CREATE TRIGGER trg_answer_votes_after_insert
  AFTER INSERT ON public.answer_votes
FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_answer_votes_after_insert();

CREATE TRIGGER trg_answer_votes_after_delete
  AFTER DELETE ON public.answer_votes
FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_answer_votes_after_delete();
