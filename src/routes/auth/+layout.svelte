<script lang="ts">
  import { Link, Panel, Screen } from 'titchy';
  import { PUBLIC_NAME } from '$env/static/public';

  import { m } from '@/paraglide/messages';

  import type { LayoutProps } from './$types';
  import { Footer } from '$/components';

  let { children }: LayoutProps = $props();
</script>

<Screen class="auth" expandable>
  <div class="content">
    <Panel class="logo-container">
      <Link class="home-link" variant="wrapper" href="/">
        <img
          src="/imgs/logos/main.png"
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
