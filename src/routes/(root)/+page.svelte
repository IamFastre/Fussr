<script lang="ts">
  import { Button, Screen } from "titchy";
  import { m } from "@/paraglide/messages";
  import { setLocale } from "@/paraglide/runtime";
</script>

<Screen>
  <div class="langs">
    {m.language()}
    <Button onclick={() => setLocale('en')}>en</Button>
    <Button onclick={() => setLocale('ar')}>ar</Button>
  </div>
  <div class="hello">
    <span>
      {m.hello()}
    </span>
  </div>
</Screen>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  .langs {
    flex-direction: row;
    align-items: center;

    gap: 10px;
    padding: 10px;
  }

  .hello {
    flex: 1;
    @include flex-center();

    span {
      text-align: center;
      font-size: 6rem;
      font-weight: 100;
    }
  }
</style>
