alter table "public"."answer_votes" add column "sign" boolean not null default true;

alter table "public"."question_votes" add column "sign" boolean not null default true;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.trg_fnc_answer_votes_after_delete()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Set answer score
  UPDATE public.answers SET
    score = score - (CASE WHEN OLD.sign THEN +1 ELSE -1 END)
  WHERE uuid = OLD.answer;

  RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_fnc_answer_votes_after_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Set answer score
  UPDATE public.answers SET
    score = score + (CASE WHEN NEW.sign THEN +1 ELSE -1 END)
  WHERE uuid = NEW.answer;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_fnc_answer_votes_before_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Disallow updates, a true man deletes and reinserts
  RAISE EXCEPTION 'Updating answer votes is not allowed' USING ERRCODE = 'operation_not_supported';
  RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_fnc_answers_after_delete()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Set question answers
  UPDATE public.questions SET
    answers = answers - 1
  WHERE uuid = OLD.question;

  RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_fnc_answers_after_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Set question answers
  UPDATE public.questions SET
    answers = answers + 1
  WHERE uuid = NEW.question;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_fnc_answers_after_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.trg_fnc_question_follows_after_delete()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Set question follows
  UPDATE public.questions SET
    follows = follows - 1
  WHERE uuid = OLD.question;

  RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_fnc_question_follows_after_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Set question follows
  UPDATE public.questions SET
    follows = follows + 1
  WHERE uuid = NEW.question;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_fnc_question_follows_before_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Disallow updates, a true man deletes and reinserts
  RAISE EXCEPTION 'Updating question follows is not allowed' USING ERRCODE = 'operation_not_supported';
  RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_fnc_question_votes_after_delete()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Set question score
  UPDATE public.questions SET
    score = score - (CASE WHEN OLD.sign THEN +1 ELSE -1 END)
  WHERE uuid = OLD.question;

  RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_fnc_question_votes_after_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Set question score
  UPDATE public.questions SET
    score = score + (CASE WHEN NEW.sign THEN +1 ELSE -1 END)
  WHERE uuid = NEW.question;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_fnc_question_votes_before_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Disallow updates, a true man deletes and reinserts
  RAISE EXCEPTION 'Updating question votes is not allowed' USING ERRCODE = 'operation_not_supported';
  RETURN NULL;
END;
$function$
;

CREATE TRIGGER trg_answer_votes_after_delete AFTER DELETE ON public.answer_votes FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_answer_votes_after_delete();

CREATE TRIGGER trg_answer_votes_after_insert AFTER INSERT ON public.answer_votes FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_answer_votes_after_insert();

CREATE TRIGGER trg_answer_votes_before_update BEFORE UPDATE ON public.answer_votes FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_answer_votes_before_update();

CREATE TRIGGER trg_answers_after_delete AFTER DELETE ON public.answers FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_answers_after_delete();

CREATE TRIGGER trg_answers_after_insert AFTER INSERT ON public.answers FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_answers_after_insert();

CREATE TRIGGER trg_answers_after_update AFTER UPDATE ON public.answers FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_answers_after_update();

CREATE TRIGGER trg_question_follows_after_delete AFTER DELETE ON public.question_follows FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_question_follows_after_delete();

CREATE TRIGGER trg_question_follows_after_insert AFTER INSERT ON public.question_follows FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_question_follows_after_insert();

CREATE TRIGGER trg_question_follows_before_update BEFORE UPDATE ON public.question_follows FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_question_follows_before_update();

CREATE TRIGGER trg_question_votes_after_delete AFTER DELETE ON public.question_votes FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_question_votes_after_delete();

CREATE TRIGGER trg_question_votes_after_insert AFTER INSERT ON public.question_votes FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_question_votes_after_insert();

CREATE TRIGGER trg_question_votes_before_update BEFORE UPDATE ON public.question_votes FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_question_votes_before_update();


