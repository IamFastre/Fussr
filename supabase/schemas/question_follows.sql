--<< QUESTION_FOLLOWS >>--------------------------------------------------------

CREATE TABLE public.question_follows (
  --- Properties ---
  "uuid" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
  "question" UUID NOT NULL,
  "user" UUID NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  --- Constrains ---
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

--<< Trigger Functions >>-------------------------------------------------------

--- BEFORE UPDATE ---
CREATE OR REPLACE FUNCTION public.trg_fnc_question_follows_before_update()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET SEARCH_PATH = public
AS $$
BEGIN
  -- Disallow updates, a true man deletes and reinserts
  RAISE EXCEPTION 'Updating question follows is not allowed' USING ERRCODE = 'operation_not_supported';
  RETURN NULL;
END;
$$;

--- AFTER INSERT ---
CREATE OR REPLACE FUNCTION public.trg_fnc_question_follows_after_insert()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET SEARCH_PATH = public
AS $$
BEGIN
  -- Set question follows
  UPDATE public.questions SET
    follows = follows + 1
  WHERE uuid = NEW.question;

  RETURN NEW;
END;
$$;

--- AFTER DELETE ---
CREATE OR REPLACE FUNCTION public.trg_fnc_question_follows_after_delete()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET SEARCH_PATH = public
AS $$
BEGIN
  -- Set question follows
  UPDATE public.questions SET
    follows = follows - 1
  WHERE uuid = OLD.question;

  RETURN OLD;
END;
$$;

--<< Triggers >>----------------------------------------------------------------

CREATE TRIGGER trg_question_follows_before_update
  BEFORE UPDATE ON public.question_follows
FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_question_follows_before_update();

CREATE TRIGGER trg_question_follows_after_insert
  AFTER INSERT ON public.question_follows
FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_question_follows_after_insert();

CREATE TRIGGER trg_question_follows_after_delete
  AFTER DELETE ON public.question_follows
FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_question_follows_after_delete();
