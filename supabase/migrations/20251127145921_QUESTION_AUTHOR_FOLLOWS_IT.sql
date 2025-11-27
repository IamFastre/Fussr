set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.trg_fnc_questions_after_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.question_follows
    (question, "user")
  VALUES
    (NEW.uuid, NEW.author);

  RETURN NEW;
END;
$function$
;

CREATE TRIGGER trg_questions_after_insert AFTER INSERT ON public.questions FOR EACH ROW EXECUTE FUNCTION public.trg_fnc_questions_after_insert();


