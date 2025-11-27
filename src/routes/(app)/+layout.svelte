<script lang="ts">
  import { Screen } from 'titchy';
  import { Cog, House, Info, UserRound } from '@lucide/svelte';

  import { Footer, Navbar, type Route } from '$/components';
  import { m } from '@/paraglide/messages';

	let { data, children } = $props();

  const routes: Route[] = [
    {
      icon: House,
      name: m.routes_home(),
      href: "/",
      hidden: false
    },
    {
      icon: UserRound,
      name: m.routes_me(),
      href: "/me",
      hidden: !data.auth.isSigned
    },
    {
      icon: Cog,
      name: m.routes_settings(),
      href: "/settings",
      hidden: false
    },
    {
      icon: Info,
      name: m.routes_about(),
      href: "/about",
      hidden: false
    },
  ];
</script>

<Screen class="nav-holder" expandable>
  <Navbar {routes} />
  <div class="content">
    {@render children?.()}
  </div>
</Screen>

<Footer />

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  :global {
    .titchy.screen.nav-holder.safe-area-padding {
      padding-top:    safe(top,    10px) !important;
      padding-left:   safe(left,   10px) !important;
      padding-bottom: safe(bottom, 10px) !important;
      padding-right:  safe(right,  10px) !important;

      @include small-screen { flex-direction: column; }
      @include wide-screen  { flex-direction: row;    }

      > .content {
        flex: 1;
        gap: 10px;

        @include small-screen { padding: 0;      }
        @include wide-screen  { padding: 0 10px; }
      }
    }
  }
</style>
