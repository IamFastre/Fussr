import type { JSON, OmitNever, QuestionPublic, UserPublic } from "$/utils/types";
import type { QuestionForm, RecoveryForm, SignInForm, SignUpForm } from "$/utils/zod/forms";


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

  "/users/[username]": {
    Method: 'GET';
    Params: { username: string };
    Args:   undefined;
    Return: UserPublic;
  };

  /* ======================================================================== */

  "/questions/[uuid]": {
    Method: 'GET';
    Params: { uuid:string };
    Args:   undefined;
    Return: QuestionPublic;
  };

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
};
