--<< ANSWERS >>-----------------------------------------------------------------

CREATE TABLE public.answers (
  --- Properties ---
  "uuid" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
  "question" UUID NOT NULL,
  "body" TEXT NOT NULL,
  "score" BIGINT NOT NULL DEFAULT 0,
  "author" UUID NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  --- Constrains ---
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

--<< Trigger Functions >>-------------------------------------------------------

--- AFTER INSERT ---
CREATE OR REPLACE FUNCTION public.trg_fnc_answers_after_insert()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET SEARCH_PATH = public
AS $$
BEGIN
  -- Set question answers
  UPDATE public.questions SET
    answers = answers + 1
  WHERE uuid = NEW.question;

  RETURN NEW;
END;
$$;

--- AFTER UPDATE ---
CREATE OR REPLACE FUNCTION public.trg_fnc_answers_after_update()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET SEARCH_PATH = public
AS $$
BEGIN
  IF NEW.question <> OLD.question THEN
    -- Set new question answers
    UPDATE public.questions SET
      answers = answers + 1
    WHERE uuid = NEW.question;

    -- Set old question answers
    UPDATE public.questions SET
      answers = answers - 1
    WHERE uuid = OLD.question;
  END IF;

  RETURN NEW;
END;
$$;

--- AFTER DELETE ---
CREATE OR REPLACE FUNCTION public.trg_fnc_answers_after_delete()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET SEARCH_PATH = public
AS $$
BEGIN
  -- Set question answers
  UPDATE public.questions SET
    answers = answers - 1
  WHERE uuid = OLD.question;

  RETURN OLD;
END;
$$;

--<< Triggers >>----------------------------------------------------------------

CREATE TRIGGER trg_answers_after_insert
  AFTER INSERT ON public.answers
FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_answers_after_insert();

CREATE TRIGGER trg_answers_after_update
  AFTER UPDATE ON public.answers
FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_answers_after_update();

CREATE TRIGGER trg_answers_after_delete
  AFTER DELETE ON public.answers
FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_answers_after_delete();
