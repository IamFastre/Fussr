<script lang="ts">
  import { Screen } from 'titchy';

  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
</script>

<Screen>
  {@render children()}
</Screen>