<script lang="ts">
  import { Panel, Screen } from 'titchy';
  import { PUBLIC_NAME } from '$env/static/public';

  import { m } from '@/paraglide/messages';

  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
</script>

<Screen class="auth" expandable>
  <div class="content">
    <Panel class="logo-container">
      <img
        src="/imgs/logos/main.png"
        alt="{PUBLIC_NAME}'s logo"
        class="logo"
      />
      <h2>
        {m.fussr()}
      </h2>
    </Panel>

    <Panel class="auth-container" variant="secondary">
      {@render children()}
    </Panel>
  </div>
</Screen>

<style lang="scss">
  @use "./styles.scss";
</style>
