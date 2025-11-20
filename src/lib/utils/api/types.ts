import type { JSON, OmitNever } from "../types";


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
  /* ======================================================================== */

  "~template~": {
    Method: 'GET';
    Params: undefined;
    Args:   undefined;
    Return: Endpoint['Method'];
  };

  /* ================================= Auth ================================= */

  "/auth": {
    Method: 'GET';
    Params: undefined;
    Args:   undefined;
    Return: "OK";
  };

  "/auth/sign-in": {
    Method: 'POST';
    Params: undefined;
    Args:   { email: string; password: string; };
    Return: "OK";
  };

  "/auth/sign-up": {
    Method: 'POST';
    Params: undefined;
    Args:   { username: string; email: string; password: string; };
    Return: "OK";
  };

  /* ======================================================================== */
};
