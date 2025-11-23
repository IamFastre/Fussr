import type { Icon as IconType } from "@lucide/svelte";

export type Route = {
  icon:   typeof IconType;
  name:   string;
  href:   string;
  hidden: boolean;
};
