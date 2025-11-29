<script lang="ts">
  import { Profile } from "$/components";

  const { data } = $props();
</script>

<Profile user={data.user} />

<style lang="scss">
  @use "@/styles/utils.scss" as *;
</style>
