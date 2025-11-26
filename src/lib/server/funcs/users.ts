import { UsernameShape } from "$/utils/zod/forms";
import { getRequestEvent } from "$app/server";

export async function getUserByUUID(uuid: string) {
  const event = getRequestEvent();

  const { supabase } = event.locals;

  const res = await supabase.admin
    .from('users')
    .select('*')
    .eq('uuid', uuid)
    .single();

  return res.data;
}

export async function getUserByName(username: string) {
  const event = getRequestEvent();

  const { supabase } = event.locals;
  const { success, data } = UsernameShape.safeParse(username);

  if (!success)
    return null;

  const res = await supabase.admin
    .from('users')
    .select('*')
    .ilike('username', data)
    .single();

  return res.data;
}
