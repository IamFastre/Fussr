<script lang="ts">
  import 'titchy/styles';

	import '@/styles/global.scss';
  import '@/styles/prism.material-dark.scss';
  import '@/styles/prism.material-light.scss';

  import { browser } from '$app/environment';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { Toaster } from 'titchy';

	let { children } = $props();

  const client = new QueryClient({
    defaultOptions: { queries: { enabled:browser } },
  });
</script>

<QueryClientProvider {client}>
	{@render children?.()}
	<Toaster />
</QueryClientProvider>
