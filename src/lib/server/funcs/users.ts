import type { UserPublic } from "$/utils/types";
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

  if (!res.data)
    return null;

  return {
    uuid:         res.data.uuid,
    username:     res.data.username,
    display_name: res.data.display_name,
    avatar:       res.data.avatar,
    country:      res.data.country,
    bio:          res.data.bio,
    created_at:   res.data.created_at,
  } as UserPublic;
}
