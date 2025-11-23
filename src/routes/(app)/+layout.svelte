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

<Screen class="nav-holder">
  <Navbar {routes} />
  <div class="content">
    {@render children?.()}
  </div>
</Screen>

<Footer />

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  .content {
    flex: 1;
    padding: 10px;
  }
</style>
