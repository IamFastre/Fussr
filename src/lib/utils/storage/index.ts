import { browser } from "$app/environment";

import { keys } from "$/utils/funcs";

import type { LocalStorageEntries } from "./types";
import { DefaultLocalStorageEntries } from "./default";

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

export class StyleTheme {
  static get name(): string | null {
    if (!browser)
      return null;

    const html = document.documentElement;
    return html.getAttribute('data-theme');
  }

  static property(category: string, name: string): string | null {
    if (!browser)
      return null;

    const html = document.documentElement;
    const style = getComputedStyle(html);
    const value = style.getPropertyValue(`--x-${category}-${name}`);

    if (value.length)
      return value;

    console.warn(`Theme property '${category}:${name}' does not exist.`);
    return null;
  }

  static color(name: string) { return this.property('color', name); }
  static value(name: string) { return this.property('value', name); }
}
