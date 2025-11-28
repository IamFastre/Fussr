<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { page } from "$app/state";
  import { PUBLIC_NAME } from "$env/static/public";
  import { Link, Separator } from "titchy";

  import type { Route } from "./types";

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
  <div class="content">
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
  </div>
</nav>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  .navbar {
    $m: 10px;

    @include width(V(navbar-wide-width), 'all');
    @include height(V(navbar-wide-height), 'all');

    // background-color: C(secondary, 5%);
    // backdrop-filter: blur(10px);
    background-color: mix(C(secondary) 5%, C(primary));
    padding: $m;
    border-radius: $m;
    justify-content: stretch;

    .content {
      gap: $m;

      :global {
        .titchy.link.home-link {
          flex-direction: row;
          align-items: center;
          padding: 0 $m;
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
        gap: $m;
        padding: $m;
        border-radius: $m;

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
        font-family: FiraCode;
        font-size: 0.66em;
        font-style: italic;
      }

    }

    @include small-screen {
      @include width(V(navbar-small-width), 'all');
      @include height(calc(V(navbar-small-height) + V(safe-inset-bottom)), 'all');

      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;

      border-end-end-radius: 0;
      border-end-start-radius: 0;

      box-shadow: 0 0 25px set-alpha(black, 35%);

      .content {
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
          display: none;
          // margin: 0 -17.5px;
          // rotate: -90deg;
          // font-style: normal;
        }
      }
    }

    @include wide-screen {
      .content {
        position: fixed;
        @include width(calc(V(navbar-wide-width) - $m * 2), 'all');
      }
    }
  }
</style>
