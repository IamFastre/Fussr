<script lang="ts">
  import { Link } from "titchy";

  import type { QuestionPublic } from "$/utils/types";

  interface Props {
    tags: QuestionPublic['tags'];
  }

  const { tags }: Props = $props();
</script>

<div class="tags">
  {#each tags as tag, i (i)}
    <Link class="tag" variant="wrapper" href="/tags/{tag}">
      <span>#{tag}</span>
    </Link>
  {/each}
</div>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  .tags {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5ch;

    :global
    .titchy.link.tag {
      padding: 2.5px 5px;
      margin-top: 15px;

      color: C(accent);
      background-color: C(accent, 10%);

      direction: ltr;
      font-size: 0.75em;
      border-radius: 5px;
    }
  }
</style>
