<script lang="ts">
  import { Pager } from "titchy";

  import { query } from "$/client/api";
  import { Question } from "$/components";
  import { LATEST_QUESTIONS_LIMIT } from "$/utils";

  const { data } = $props();

  let page = $state(1);

  const questionsQuery = query(() => ({ method:'GET', path:'/questions/latest', args:{ page } }), data.questions);
  const questions = $derived(questionsQuery.data ?? data.questions);
</script>

{#each questions.list as question, i (i)}
  <Question {question} />
{/each}

<div class="sep"></div>

<Pager
  class="questions-pager"
  label="$page$"
  min={1} max={Math.ceil(questions.total / LATEST_QUESTIONS_LIMIT)}
  bind:value={page}
/>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  .sep {
    flex: 1;
  }

  :global
  .titchy.pager.questions-pager {
    border: none;
  }
</style>
