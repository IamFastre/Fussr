import { createQuery, type DefinedInitialDataOptions } from "@tanstack/svelte-query";

import { entries, keys } from "$/utils";
import type { EndpointRequest, Endpoints } from "$/utils/api";
import type { ResultAPI } from "$/utils/types";

function replacePathParams(path:string, params:Record<string, string | number> | undefined) {
  let result = path;

  for (const [K, V] of entries(params ?? { }))
    result = result.replaceAll('[' + K + ']', String(V));

  return result;
}

/* ========================================================================== */

export async function api<T extends keyof Endpoints>(req: EndpointRequest<T>)
{
  const fullPath = replacePathParams(`${location.origin}/api/${req.path.replace('/', '')}`, req.params);
  const url      = new URL(fullPath);
  const isGET    = req.method === 'GET';

  // If it's a GET request then add the args to search params instead
  if (req.args && isGET)
    for (const key of keys(req.args)) {
      const argKey = key as string;
      const argVal = (req.args)[key];

      url.searchParams.set(argKey, String(argVal));
    }

  // Fetching depending on the method type
  const response = isGET
    ? await fetch(url, {
        method: 'GET'
      })
    : await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(req.args)
      });

  return await response.json() as ResultAPI<Endpoints[T]['Return']>;
}

/* ========================================================================== */

type QueryOptions<T> = Partial<Omit<DefinedInitialDataOptions<T>, 'initialData' | 'queryFn' | 'queryKey'>>;

export function query<T extends keyof Endpoints>
  (reqOrFn: EndpointRequest<T> | (() => EndpointRequest<T>), initialData?: Endpoints[T]["Return"], options?: QueryOptions<Endpoints[T]["Return"]>)
{
  return createQuery(() => {
    const req = typeof reqOrFn === 'function' ? reqOrFn() : reqOrFn;

    const queryFn = async () => {
      const response = await api(req);

      if (response.data) return response.data;
      else return null!;
    }

    const queryKey = [
      req.path,
      req.params ? entries(req.params) : undefined,
      req.args   ? entries(req.args)   : undefined,
    ];

    return {
      initialData,
      queryFn,
      queryKey,
      retry: false,
      ...options
    }
  });
}
