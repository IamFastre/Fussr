<script lang="ts">
  import { Screen } from "titchy";

  import { m } from "@/paraglide/messages";
  import { Footer } from "$/components";
</script>

<Screen expandable>
  <div class="me">
    ME MANAGE
  </div>
</Screen>

<Footer />

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  .me {
    flex: 1;
    @include flex-center();
  }
</style>
