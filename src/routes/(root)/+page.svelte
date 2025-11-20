<script lang="ts">
  import { Screen } from "titchy";
  import { api } from "$/client/api";

  $effect(() => {
    const func = async () => {
      const res = await api({ method:'GET', path:'/auth' });
      console.log(res)
    }

    func()
  });
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
