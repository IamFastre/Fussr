<script lang="ts">
  import { Question } from '$/components';
  import { LATEST_QUESTIONS_LIMIT } from '$/utils';
  import { m } from '@/paraglide/messages';
  import { X } from '@lucide/svelte';
  import { Button, Link, Pager, Panel } from 'titchy';

  const { data } = $props();

  let page = $state(1);
</script>

<Panel class="header" variant="secondary">
  <div class="left-stuff">
    <span>{m.tags_exploring_tags()}</span>
    <div class="tag-list">
      {#each data.tags as tag}
        <h1>#{tag}</h1>
      {/each}
    </div>
  </div>
  <div class="right-stuff">
    <Link variant="wrapper"  href="/">
      <Button variant="blank">
        <X />
      </Button>
    </Link>
  </div>
</Panel>

<Panel class="contents">
  {@html
    "\<style\>" +
    data.tags.map(t =>
      `.titchy.panel.contents .titchy.panel.question .titchy.link.tag.tag-${t}` +
      `{ background-color:var(--highlight); color:var(--primary); font-weight: bold; }`
    ).join(' ') +
    "\</style\>"
  }
  {#each data.questions.list as question}
    <Question {question} />
  {/each}
  <div class="sep"></div>

  <Pager
    class="questions-pager"
    bind:value={page}
    min={1} max={Math.ceil(data.questions.total / LATEST_QUESTIONS_LIMIT)}
    label="$page$"
  />
</Panel>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  :global
  .titchy.panel.header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 5px;

    .left-stuff {
      align-items: start;
      gap: 5px;

      .tag-list {
        flex-direction: row;
        gap: 1ch;

        h1 {
          color: C(accent);
          background-color: C(accent, 15%);
          padding: 5px;
          border-radius: 5px;
        }
      }
    }

    .right-stuff {
      .titchy.button {
        box-shadow: none;
        svg { @include size(2em); }
      }
    }
  }

  :global
  .titchy.panel.contents {
    --highlight: #{C(accent, 80%)};
    --primary: #{C(primary)};

    flex: 1;

    .sep { flex: 1; }
  }
</style>
