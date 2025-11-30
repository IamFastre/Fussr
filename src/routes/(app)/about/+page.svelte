<script lang="ts">
</script>

<div class="me">
  <span>DIDN'T HAVE TIME FOR THIS</span>
  <span>I BLAME عبمعطي</span>
  <span class="hidden">Hi, نور</span>
</div>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  .me {
    flex: 1;
    @include flex-center();
    direction: ltr;

    .hidden {
      color: transparent;
      margin-top: 10px;
    }
  }
</style>
