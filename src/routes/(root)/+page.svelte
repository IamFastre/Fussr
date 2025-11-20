<script lang="ts">
  import { Screen } from "titchy";
</script>

<Screen>
  <div class="hello">
    <span>
      Hello, thing!
    </span>
  </div>
</Screen>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

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
