<script lang="ts">
  import 'titchy/styles';
	import '@/styles/global.scss';

	let { children } = $props();
</script>

{@render children?.()}
