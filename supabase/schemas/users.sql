--<< USERS >>-------------------------------------------------------------------

CREATE TABLE public.users (
  -- Properties --
  "uuid" UUID NOT NULL,
  "username" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  -- Constrains --
  CONSTRAINT users_username_unique UNIQUE ("username"),
  CONSTRAINT users_uuid_fkey FOREIGN KEY ("uuid") REFERENCES auth.users("id") ON UPDATE CASCADE ON DELETE CASCADE
);

--<< RLS >>---------------------------------------------------------------------

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Disallow all anons" ON public.users AS PERMISSIVE FOR ALL TO ANON USING (FALSE) WITH CHECK (FALSE);

--<< Indices >>-----------------------------------------------------------------

CREATE INDEX idx_users_uuid ON public.users ("uuid");
CREATE INDEX idx_users_username ON public.users ("username");

--------------------------------------------------------------------------------

-- Whenever Supabase creates a user record, add another here to store the extra data

CREATE FUNCTION public.on_new_user()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  SECURITY DEFINER
  SET SEARCH_PATH = PUBLIC, AUTH
  AS $$
BEGIN
  INSERT INTO public.users
    ("uuid", "username")
  VALUES
    (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', NEW.id::text));
  RETURN NULL;
END
$$;

CREATE TRIGGER new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
EXECUTE FUNCTION public.on_new_user();

