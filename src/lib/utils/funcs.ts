/* ============================ Object Functions ============================ */

/**
 * Checks if the given value is nullable; `null` or `undefined`.
 * @returns `true` if the value is `null` or `undefined`, otherwise `false`.
 */
export function isNullable(obj: unknown): obj is null | undefined {
  return obj === null || obj === undefined;
}

/**
 * Wrapper function around the `Object.keys` static method for better types.
 * @returns Properly typed keys array.
 */
export function keys<T extends object>(obj: T) {
  if (isNullable(obj)) return [];
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Wrapper function around the `Object.values` static method for better types.
 * @returns Properly typed values array.
 */
export function values<T extends object>(obj: T) {
  if (isNullable(obj)) return [];
  return Object.values(obj) as T[keyof T][];
}

/**
 * Wrapper function around the `Object.entries` static method for better types.
 * @returns Properly typed entries array.
 */
export function entries<T extends object>(obj: T) {
  if (isNullable(obj)) return [];
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

/**
 * Sorts an object in alphabetical order to its keys.
 * @returns Sorted version `obj` by its keys in ascending order.
 * If the input object is `null`, it will return `null`.
 */
export function sort<T extends unknown[] | Record<number | string, unknown> | null>(obj: T): typeof obj {
  if (obj === null) return obj;
  return keys(obj).sort().reduce((r, k) => (r![k] = obj![k], r), { } as T);
}

/**
 * Combines two objects into one without spreading.
 * Can help with functions, or other data types that don't do well with spreading.
 * @returns Object with added properties.
 */
export function define<T extends object, P extends object>(obj: T, props: P): T & P {
  const descriptors = Object.getOwnPropertyDescriptors(props);
  return Object.defineProperties(obj, descriptors) as T & P;
}

/* ========================================================================== */

/**
 * Clamps `num` between `min` and `max`.
 * @returns Number that is no bigger than `max` or smaller than `min`.
 */
export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Adds zero padding to a `value` with specified `length`.
 * @returns Number with left zero padding.
 */
export function zeroPadding(value: number | string, length: number) {
  return String(value).padStart(length, "0");
}

/**
 * Waits for a specified period in `ms` with Promises.
 * @returns Promise that resolves in `ms`.
 */
export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
