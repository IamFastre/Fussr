<script lang="ts">
  import { onMount } from 'svelte';
  import { Link, Panel, Screen } from 'titchy';
  import { PUBLIC_NAME } from '$env/static/public';

  import { m } from '@/paraglide/messages';

  import type { LayoutProps } from './$types';
  import { Footer } from '$/components';
  import { StyleTheme } from '$/client/styles';

  let { children }: LayoutProps = $props();

  onMount(() => {
    const onChange = () => {
      assets = StyleTheme.property('theme', 'assets') as 'light' ?? 'light';
    };

    onChange();

    window.addEventListener('custom-local-storage', onChange);
    return () => window.removeEventListener('custom-local-storage', onChange);
  });

  let assets = $state<'dark' | 'light'>('light');
</script>

<Screen class="auth" expandable>
  <div class="content">
    <Panel class="logo-container">
      <Link class="home-link" variant="wrapper" href="/">
        <img
          src="/imgs/logos/main_{assets}.png"
          alt="{PUBLIC_NAME}'s logo"
          class="logo"
        />
        <h2>{m.fussr()}</h2>
      </Link>
    </Panel>

    <Panel class="auth-container" variant="secondary">
      {@render children()}
    </Panel>
  </div>
</Screen>

<Footer />

<style lang="scss">
  @use "./styles.scss";
</style>
