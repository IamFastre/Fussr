import { keys } from "$/utils/funcs";

import { DefaultLocalStorageEntries } from "./default";
import type { LocalStorageEntries } from "./types";

export * from "./default";
export * from "./types";

export class LocalStorage {
  static EVENT_NAME = 'custom-local-storage';

  static get<T extends keyof LocalStorageEntries>(key: T): LocalStorageEntries[T] {
    const stored   = JSON.parse(localStorage.getItem(key)!);
    const $default = DefaultLocalStorageEntries[key];

    return stored ?? $default;
  }

  static set<T extends keyof LocalStorageEntries>(key: T, value: LocalStorageEntries[T]): boolean {
    if (!keys(DefaultLocalStorageEntries).includes(key))
      return false;

    const old = JSON.parse(localStorage.getItem(key)!);
    localStorage.setItem(key, JSON.stringify(value));

    const event = new CustomEvent(this.EVENT_NAME, {
      detail: {
        key,
        value,
        old,
        default: DefaultLocalStorageEntries[key],
      }
    });

    window.dispatchEvent(event);
    return true;
  }

  static reset<T extends keyof LocalStorageEntries>(key: T): boolean {
    return this.set(key, DefaultLocalStorageEntries[key]);
  }
}
