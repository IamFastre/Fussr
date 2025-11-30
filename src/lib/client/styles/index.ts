import { browser } from "$app/environment";

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

    const html  = document.documentElement;
    const style = getComputedStyle(html);
    const value = style.getPropertyValue(`--fussr-${category}-${name}`)
      .replace(/(^['"])|(["']$)/g, '');

    if (value.length)
      return value;

    console.warn(`Theme property '${category}:${name}' does not exist.`);
    return null;
  }

  static color(name: string) { return this.property('color', name); }
  static value(name: string) { return this.property('value', name); }
}
