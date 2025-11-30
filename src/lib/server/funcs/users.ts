import sharp from 'sharp';

import { LATEST_QUESTIONS_LIMIT } from "$/utils";
import type { AnswerDetailed, QuestionPublic, UserPublic, VoteDetailed } from "$/utils/types";
import { ProfileEditForm, UsernameShape } from "$/utils/zod/forms";
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

export async function getUserQuestions({ uuid, page }: { uuid:string, page:number }) {
  const event = getRequestEvent();
  const { supabase } = event.locals;

  const res = await supabase.admin
    .from('questions')
    .select('*, author:users(*)', { count:'exact' })
    .eq('author', uuid)
    .order('created_at', { ascending: false })
    .range((page - 1) * LATEST_QUESTIONS_LIMIT, (page * LATEST_QUESTIONS_LIMIT) - 1);

  if (res.error || !res.data)
    return { list:[], total: 0 };

  const list = res.data.map(q => ({
    uuid:       q.uuid,
    title:      q.title,
    body:       q.body,
    tags:       q.tags,
    score:      q.score,
    answers:    q.answers,
    follows:    q.follows,
    author:     q.author,
    created_at: q.created_at,
  } as QuestionPublic));

  return {
    list,
    total: res.count ?? 0,
  }
}

export async function getUserAnswers({ uuid, page }: { uuid:string, page:number }) {
  const event = getRequestEvent();
  const { supabase } = event.locals;

  const res = await supabase.admin
    .from('answers')
    .select('*, author:users(*), question:questions(*, author:users(*))', { count:'exact' })
    .eq('author', uuid)
    .order('created_at', { ascending: false })
    .range((page - 1) * LATEST_QUESTIONS_LIMIT, (page * LATEST_QUESTIONS_LIMIT) - 1);

  if (res.error || !res.data)
    return { list:[], total: 0 };

  const list = res.data.map(a => ({
    uuid:        a.uuid,
    body:        a.body,
    score:       a.score,
    question:    a.question,
    is_solution: a.is_solution,
    author:      a.author,
    created_at:  a.created_at,
  } as AnswerDetailed));

  return {
    list,
    total: res.count ?? 0,
  }
}

export async function getUserVotes({ uuid, page }: { uuid:string, page:number }) {
  const event = getRequestEvent();
  const { supabase } = event.locals;

  const res = await supabase.admin
    .from('question_votes')
    .select('*, question:questions(*, author:users(*))', { count:'exact' })
    .eq('author', uuid)
    .order('created_at', { ascending: false })
    .range((page - 1) * LATEST_QUESTIONS_LIMIT, (page * LATEST_QUESTIONS_LIMIT) - 1);

  if (res.error || !res.data)
    return { list:[], total: 0 };

  const list = res.data.map(v => ({
    uuid:       v.uuid,
    sign:       v.sign ? 'up' : 'down',
    question:   v.question,
    author:     v.author,
    created_at: v.created_at,
  } as VoteDetailed));

  return {
    list,
    total: res.count ?? 0,
  }
}

export async function editUser(args: ProfileEditForm) {
  const event = getRequestEvent();

  const { supabase, auth } = event.locals;

  const { success, data } = ProfileEditForm.safeParse(args);

  if (!success || !auth.user)
    return null;

  const user = await getUserByUUID(auth.user.id);
  const { avatar, ...newUser } = data;

  newUser.bio          = newUser.bio.length ? newUser.bio : undefined!;
  newUser.display_name = newUser.display_name.length ? newUser.display_name : undefined!;
  newUser.country      = newUser.country.length ? newUser.country : undefined!;

  const res = await supabase.admin
    .from('users')
    .update({ ...newUser, avatar: avatar ? `/api/users/${user!.username}/avatar?t=${Date.now()}` : undefined })
    .eq('uuid', auth.user.id);

  if (res.error)
    return null;

  await supabase.admin.storage
    .createBucket(
      'avatars',
      { public:true, allowedMimeTypes:['image/png'], fileSizeLimit:'0.5MB' }
    )

  if (avatar) {
    await supabase.admin.storage
      .from('avatars')
      .update(`${auth.user.id}.png`, await compressAvatar(avatar))
  }

  return auth.user.id;
}

export async function resetAvatar() {
  const event = getRequestEvent();
  const { supabase, auth } = event.locals;

  if (!auth.user)
    return null;

  const user = await getUserByUUID(auth.user.id);

  const storageRes = await supabase.admin.storage
    .from('avatars')
    .remove([`${auth.user.id}.png`])

  if (storageRes.error)
    return null;

  const res = await supabase.admin
    .from('users')
    .update({ avatar:`/api/users/${user!.username}/avatar?t=${Date.now()}` })
    .eq('uuid', auth.user.id);

  if (res.error)
    return null;

  return "OK";
}

/* ========================================================================== */

async function compressAvatar(avatar: string) {
  const base64Data = avatar.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  let resizedBuffer = await sharp(buffer)
    .resize(256, 256)
    .png()
    .toBuffer();

  // Keep lowering the quality until it's less than 0.5mb
  while (resizedBuffer.byteLength > 500_000) {
    resizedBuffer = await sharp(resizedBuffer)
      .png({ quality: 90 })
      .toBuffer();
  }

  return new Blob([resizedBuffer as BlobPart], { type: 'image/png' });
}
