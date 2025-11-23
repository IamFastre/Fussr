--<< USERS >>-------------------------------------------------------------------

CREATE TABLE public.users (
  -- Properties --
  "uuid" UUID NOT NULL,
  "username" TEXT NOT NULL UNIQUE,
  "display_name" TEXT NULL,
  "bio" TEXT NULL,
  "avatar" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  -- Constrains --
  CONSTRAINT users_uuid_fkey FOREIGN KEY ("uuid") REFERENCES auth.users("id") ON UPDATE CASCADE ON DELETE CASCADE
);

--<< RLS >>---------------------------------------------------------------------

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Disallow all anons" ON public.users AS PERMISSIVE FOR ALL TO ANON USING (FALSE) WITH CHECK (FALSE);

--<< Indexes >>-----------------------------------------------------------------

CREATE INDEX idx_users_uuid ON public.users ("uuid");
CREATE UNIQUE INDEX idx_users_username_lower ON public.users (LOWER("username"));

--------------------------------------------------------------------------------

-- Whenever Supabase creates a user record, add another here to store the extra data
CREATE FUNCTION public.on_new_auth_user()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  SECURITY DEFINER
  SET SEARCH_PATH = PUBLIC, AUTH
  AS $$
DECLARE
  uname TEXT;
BEGIN
  uname := NEW.raw_user_meta_data->>'username';

  INSERT INTO public.users
    ("uuid", "username", "avatar")
  VALUES
    (
      NEW.id,
      COALESCE(uname, NEW.id::TEXT),
      FORMAT('/api/users/%s/avatar', uname)
    );
  RETURN NULL;
END
$$;

CREATE TRIGGER new_auth_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
EXECUTE FUNCTION public.on_new_auth_user();
