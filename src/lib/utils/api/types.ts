import type { AnswerDetailed, AnswerPersonal, AnswerPublic, JSON, OmitNever, QuestionPersonal, QuestionPublic, UserPublic, VoteDetailed } from "$/utils/types";
import type { AnswerForm, ProfileEditForm, QuestionForm, RecoveryForm, SignInForm, SignUpForm } from "$/utils/zod/forms";


export type Endpoints = OmitNever<{
  [K in EndpointKeys]: EndpointsMap[K] extends Endpoint ? EndpointsMap[K] : never
}>;

export type EndpointKeys = keyof EndpointsMap;

export type EndpointRequest<T extends keyof Endpoints> = {
  path:    T;
  method:  Endpoints[T]['Method'];
  params?: Endpoints[T]['Params'];
  args?:   Endpoints[T]['Args'];
}

/* ========================================================================== */
/*                               REST Endpoints                               */
/* ========================================================================== */

export interface Endpoint<
  M extends 'GET' | 'POST' = 'GET' | 'POST',
  P extends Record<string, string | number> | undefined = Record<string, string | number> | undefined,
  A extends Record<string, JSON> | undefined = Record<string, JSON> | undefined,
  R extends JSON = JSON
> {
  Method: M;
  Params: P;
  Args:   A;
  Return: R;
}

type EndpointsMap = {
  /* ================================= Auth ================================= */

  // This is to just shut client `api` function
  "/auth": {
    Method: 'GET';
    Params: undefined;
    Args:   undefined;
    Return: "OK";
  };

  "/auth/sign-in": {
    Method: 'POST';
    Params: undefined;
    Args:   SignInForm;
    Return: "OK";
  };

  "/auth/sign-up": {
    Method: 'POST';
    Params: undefined;
    Args:   SignUpForm;
    Return: "OK";
  };

  "/auth/sign-out": {
    Method: 'POST';
    Params: undefined;
    Args:   undefined;
    Return: "OK";
  };

  "/auth/recovery": {
    Method: 'POST';
    Params: undefined;
    Args:   RecoveryForm;
    Return: "OK";
  };

  /* ======================================================================== */

  "/users/edit": {
    Method: 'POST';
    Params: undefined;
    Args:   ProfileEditForm;
    Return: "OK";
  };

  "/users/reset-avatar": {
    Method: 'POST';
    Params: undefined;
    Args:   undefined;
    Return: "OK";
  };

  "/users/[username]": {
    Method: 'GET';
    Params: { username: string };
    Args:   undefined;
    Return: UserPublic;
  };

  "/users/[username]/questions": {
    Method: 'GET';
    Params: { username: string };
    Args:   { page?:number };
    Return: { list:QuestionPublic[], total:number };
  };

  "/users/[username]/answers": {
    Method: 'GET';
    Params: { username: string };
    Args:   { page?:number };
    Return: { list:AnswerDetailed[], total:number };
  };

  "/users/[username]/votes": {
    Method: 'GET';
    Params: { username: string };
    Args:   { page?:number };
    Return: { list:VoteDetailed[], total:number };
  };

  /* ======================================================================== */

  "/questions/[uuid]": {
    Method: 'GET';
    Params: { uuid:string };
    Args:   undefined;
    Return: QuestionPersonal;
  };

  "/questions/[uuid]/vote": {
    Method: 'POST';
    Params: { uuid:string };
    Args:   { vote:'up' | 'down' | 'none' };
    Return: "OK";
  };

  "/questions/[uuid]/follow": {
    Method: 'POST';
    Params: { uuid:string };
    Args:   undefined;
    Return: "OK";
  };

  "/questions/[uuid]/delete": {
    Method: 'POST';
    Params: { uuid:string };
    Args:   undefined;
    Return: "OK";
  };

  "/questions/[uuid]/answer": {
    Method: 'POST';
    Params: { uuid:string };
    Args:   Pick<AnswerForm, 'body'>;
    Return: AnswerPublic;
  };

  "/questions/[uuid]/answers": {
    Method: 'GET';
    Params: { uuid:string };
    Args:   { page?:number };
    Return: { list:AnswerPersonal[], total:number };
  };

  /* ======================================================================== */

  "/questions/latest": {
    Method: 'GET';
    Params: undefined;
    Args:   { page?:number };
    Return: { list:QuestionPublic[], total:number };
  };

  "/questions/ask": {
    Method: 'POST';
    Params: undefined;
    Args:   QuestionForm;
    Return: QuestionPublic;
  };

  /* ======================================================================== */

  "/answers/[uuid]/vote": {
    Method: 'POST';
    Params: { uuid:string };
    Args:   { vote:'up' | 'down' | 'none' };
    Return: "OK";
  };

  "/answers/[uuid]/delete": {
    Method: 'POST';
    Params: { uuid:string };
    Args:   undefined;
    Return: "OK";
  };

  "/answers/[uuid]/mark-solution": {
    Method: 'POST';
    Params: { uuid:string };
    Args:   undefined;
    Return: "OK";
  };

  /* ======================================================================== */
};
