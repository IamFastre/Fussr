import type { Tables } from "$/supabase/types";

/* ========================================================================== */
/*                                   Generic                                  */
/* ========================================================================== */

export type Nullable = null | undefined;

export type Obj = { [key:string]: JSON | undefined }

export type JSON =
  | string
  | number
  | boolean
  | null
  | Obj
  | JSON[];

/* ========================================================================== */
/*                                 Functional                                 */
/* ========================================================================== */

export type KeyOf<T> = keyof T;
export type ValueOf<T> = T[keyof T];

export type UnionPick<T, K extends T> = T & K;

export type Without<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K]; };

export type RequiredKeys<T> = { [K in keyof T]-?: object extends Pick<T, K> ? never : K }[keyof T];
export type OptionalKeys<T> = { [K in keyof T]-?: object extends Pick<T, K> ? K : never }[keyof T];

export type OnlyOptional<T> = { [K in keyof T as undefined extends T[K] ? K : never]-?: Exclude<T[K], undefined>; };
export type OnlyRequired<T> = { [K in keyof T as undefined extends T[K] ? never : K]-?: Exclude<T[K], undefined>; };

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [P in K] ?: T[K] };
export type MakeRequired<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: T[K] };

export type DeepPartial<T>  = { [P in keyof T] ?: DeepPartial<T[P]>;  };
export type DeepRequired<T> = { [P in keyof T]-?: DeepRequired<T[P]>; };

/* ========================================================================== */
/*                                 API Related                                */
/* ========================================================================== */

export interface ErrorAPI {
  code?: number | string;
  description?: string | null;
  message: string;
  side?: "CL" | "SR" | "DB";
}

export type ResultAPI<T> = (
  { data: T;    error: null;     } |
  { data: null; error: ErrorAPI; }
);

/* ========================================================================== */
/*                              Supabase Related                              */
/* ========================================================================== */

export type VoteDirection = 'up' | 'down' | 'none';

export type UserPublic = {
  uuid:         Tables<'users'>['uuid'];
  username:     Tables<'users'>['username'];
  display_name: Tables<'users'>['display_name'];
  bio:          Tables<'users'>['bio'];
  avatar:       Tables<'users'>['avatar'];
  country:      Tables<'users'>['country'];
  created_at:   Tables<'users'>['created_at'];
}

export type QuestionPublic = {
  uuid:       Tables<'questions'>['uuid'];
  title:      Tables<'questions'>['title'];
  body:       Tables<'questions'>['body'];
  tags:       Tables<'questions'>['tags'];
  score:      Tables<'questions'>['score'];
  answers:    Tables<'questions'>['answers'];
  follows:    Tables<'questions'>['follows'];
  author:     UserPublic;
  created_at: Tables<'questions'>['created_at'];
}

export type QuestionPersonal = QuestionPublic & {
  vote:   VoteDirection;
  follow: boolean;
};

export type AnswerPublic = {
  uuid:       Tables<'answers'>['uuid'];
  body:       Tables<'answers'>['body'];
  score:      Tables<'answers'>['score'];
  question:   Tables<'answers'>['question'];
  author:     Tables<'answers'>['author'];
  created_at: Tables<'answers'>['created_at'];
};

export type AnswerPersonal = AnswerPublic & {
  vote: VoteDirection;
};
