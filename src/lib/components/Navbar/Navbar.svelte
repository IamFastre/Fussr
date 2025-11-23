<script lang="ts">
  import { PUBLIC_NAME } from "$env/static/public";
  import { m } from "@/paraglide/messages";
  import type { HTMLAttributes } from "svelte/elements";
  import { Link, Separator } from "titchy";
  import type { Route } from "./types";
  import { page } from "$app/state";

  interface Props {
    routes: Route[];
  }

  const {
    routes,
    ...rest
  }: Props & HTMLAttributes<HTMLElement> = $props();
</script>

<nav
  class="navbar"
  {...rest}
>
  <Link class="home-link" variant="wrapper" href="/">
    <img
      src="/imgs/logos/alt_light.png"
      alt="{PUBLIC_NAME}'s logo"
    />
  </Link>
  <div class="routes">
    {#each routes as route, i (i)}
      {#if !route.hidden}
        {@const active = page.url.pathname === route.href}
        {@const Icon = route.icon}
        <Link class={["route", { active }]} variant="wrapper" href={route.href}>
          <Icon />
          <span class="name">
            {route.name}
          </span>
        </Link>
        {#if i < routes.length - 1}
          <Separator variant="primary" thickness="s" />
        {/if}
      {/if}
    {/each}
  </div>
  <span class="version">
    v0.0.1
  </span>
  {@render rest.children?.()}
</nav>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  :global {
    .titchy.screen.nav-holder {
      @include small-screen { flex-direction: column; }
      @include wide-screen  { flex-direction: row;    }
    }
  }

  .navbar {
    @include width(V(navbar-wide-width));
    @include height(V(navbar-wide-height));
    background-color: mix(C(secondary) 5%, C(primary));
    padding: 10px;
    margin: 10px;
    gap: 10px;
    border-radius: 10px;

    :global {
      .titchy.link.home-link {
        flex-direction: row;
        align-items: center;
        padding: 0 10px;
        justify-content: center;
        gap: 0.75ch;
        background-color: C(secondary, 5%);
        border-radius: 10px;

        img { @include size(75px); }

        &:hover, &:focus-visible {
          background-color: C(secondary, 7.5%);
        }
      }
    }

    .routes {
      background-color: C(secondary, 5%);
      gap: 10px;
      padding: 10px;
      border-radius: 10px;

      :global {
        .titchy.link.route {
          flex-direction: row;
          align-items: center;
          gap: 1ch;
          padding: 7.5px;
          border-radius: 5px;

          svg {
            @include size(1.25em);
            color: C(accent);
            stroke-width: 2.5px;
          }

          &:hover, &:focus-visible {
            background-color: C(secondary, 7.5%);
          }

          &.active {
            color: C(accent);
            font-weight: bold;
            background-color: C(secondary, 7.5%);
          }
        }

        .titchy.separator {
          opacity: 0.15;
        }
      }
    }

    .version {
      user-select: all;
      align-self: center;
      color: C(accent);
      opacity: 0.5;
      font-size: 0.66em;
      font-style: italic;
    }

    @include small-screen {
      @include width(V(navbar-small-width));
      @include height(V(navbar-small-height));

      position: fixed;
      z-index: 100;
      bottom: V(safe-inset-bottom);
      left: 0;
      right: 0;
      flex-direction: row;

      :global {
        .titchy.link.home-link {
          img { @include size(50px); }
        }
      }

      .routes {
        flex: 1;
        flex-direction: row;

        :global {
          .titchy.link.route {
            flex: 1;
            @include flex-center();

            .name { display: none; }
          }

          hr { display: none; }
        }
      }

      .version {
        margin: 0 -10px;
        rotate: -90deg;
        font-style: normal;
      }
    }
  }
</style>
