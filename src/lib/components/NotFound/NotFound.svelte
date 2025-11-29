<script lang="ts">
  import { Panel } from "titchy";
  import { CircleX } from "@lucide/svelte";

  interface Props {
    message: string;
  }

  const { message }: Props = $props();
</script>

<Panel class="not-fount">
  <CircleX />
  <span>
    {@html message}
  </span>
</Panel>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  :global
  .titchy.panel.not-fount {
    flex: 1;
    @include flex-center();

    svg {
      color: C(danger);
      @include size(5rem);
    }

    .accent {
      color: C(accent);
      background-color: C(accent, 10%);
      padding: 2.5px;
      border-radius: 5px;
      font-family: FiraCode;
    }
  }
</style>
