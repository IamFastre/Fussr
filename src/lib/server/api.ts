import { sort } from "$/utils";
import type { ErrorAPI, JSON, ResultAPI, Without } from "$/utils/types";
import type { AuthError, PostgrestError } from "@supabase/supabase-js";
import type { ZodError } from "zod";

/* ========================================================================== */

/**
 * Creates a ready `Result` object with `data` and `error`.
 * Can take additional `init` or override them.
 * @returns A new JSON Response.
 */
export function result<T extends JSON | object>(data: T | null, error: Without<Required<ErrorAPI>, 'code'> & { code?:ErrorAPI['code'] } | null, init: ResponseInit) {
  const res = { data, error: sort(error) } as ResultAPI<T>;
  return Response.json(res, init);
}


/**
 * Creates a ready `Result` object with defined `data` and null `error`.
 * Can take additional `init` or override them.
 * @returns A new JSON Response with an already set status code of 200 (OK).
 */
export function success<T extends JSON | object>(data: T, init?: ResponseInit) {
  return result(
    data, null,
    { status: 200, statusText: "OK", ...init }
  );
}


/**
 * Creates a ready `Result` object with defined `data` and null `error`.
 * Can take additional `init` or override them.
 * @returns A new JSON Response with an already set status code of 200 (OK).
 */
export function img<T extends Blob>(data: T, init?: ResponseInit) {
  const headers = {
    'Content-Type':'image/png',
    ...init?.headers
  };

  return new Response(data, { ...init, headers });
}


/**
 * Creates a ready `Result` object with null `data` and defined (404) `error`.
 * Can take additional `init` or override them.
 * @returns A new JSON Response with an already set status code of 404 (Not Found).
 */
export function notfound(error: ErrorAPI, init?: ResponseInit) {
  return result(
    null,
    { side: "CL", description: null, ...error },
    { status: 404, statusText: "Not Found", ...init }
  );
}


/**
 * Creates a ready `Result` object with null `data` and defined (400) `error`.
 * Can take additional `init` or override them.
 * @returns A new JSON Response with an already set status code of 400 (Bad Request).
 */
export function bad(error: ErrorAPI, init?: ResponseInit) {
  return result(
    null,
    { side: "CL", description: null, ...error },
    { status: 400, statusText: "Bad Request", ...init }
  );
}


/**
 * Creates a ready `Result` object with null `data` and defined (403) `error`.
 * Can take additional `init` or override them.
 * @returns A new JSON Response with an already set status code of 403 (Forbidden).
 */
export function forbidden(error: ErrorAPI, init?: ResponseInit) {
  return result(
    null,
    { side: "CL", description: null, ...error },
    { status: 403, statusText: "Forbidden", ...init }
  );
}


/**
 * Creates a ready `Result` object with null `data` and defined (422) `error`.
 * Can take additional `init` or override them.
 * @returns A new JSON Response with an already set status code of 422 (Unprocessable Content).
 */
export function invalid(error: ErrorAPI, init?: ResponseInit) {
  return result(
    null,
    { side: "CL", description: null, ...error },
    { status: 422, statusText: "Unprocessable Content", ...init }
  );
}


/**
 * Creates a ready `Result` object with null `data` and defined (500) `error`.
 * Can take additional `init` or override them.
 * @returns A new JSON Response with an already set status code of 500 (Internal Server Error).
 */
export function error(error: ErrorAPI, init?: ResponseInit) {
  return result(
    null,
    { side: "SR", description: null, ...error },
    { status: 500, statusText: "Internal Server Error", ...init }
  );
}


/**
 * Creates a ready `Result` object with null `data` and defined (403) `error`.
 * Can take additional `init` or override them.
 * @returns A new JSON Response with an already set status code of 403 (Forbidden).
 */
export function noperm(message?: string, init?: ResponseInit) {
  return forbidden({ code: "NO-PERM", message: message ?? "You do not have permissions." }, init);
}


/**
 * Creates a ready `Result` object with null `data` and defined (422) `error`.
 * Can take additional `init` or override them. Much like the `invalid` function but more
 * specialized into the errored zod parsings.
 * @returns A new JSON Response with an already set status code of 422 (Unprocessable Content).
 */
export function badparse(error: ZodError, init?: ResponseInit) {
  return invalid({ code: "ZOD", message: "Invalid input shape.", description: error.message }, init);
}


/**
 * Creates a ready `Result` object with null `data` and defined (500) `error`.
 * Can take additional `init` or override them. Much like the `error` function but more
 * specialized into the errored database responses.
 * @returns A new JSON Response with an already set status code of 500 (Internal Server Error).
 */
export function badquery(e:PostgrestError | AuthError, init?:ResponseInit) {
  const details = (e as PostgrestError).details ? ` -- ${(e as PostgrestError).details}` : '';
  return error(
    { side:"DB", code:e.code, message:`Supabase error occurred.`, description:`[${e.name}]: ${e.message}${details}` }, init
  );
}
