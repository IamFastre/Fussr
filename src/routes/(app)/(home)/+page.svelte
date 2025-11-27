<script lang="ts">
  import { query } from "$/client/api";
  import { Question } from "$/components";

  const { data } = $props();

  const questionsQuery = query({ method:'GET', path:'/questions/latest' }, data.questions);
  const questions = $derived(questionsQuery.data ?? data.questions)
</script>

{#each questions as question, i (i)}
  <Question {question} />
{/each}

<style lang="scss">
  @use "@/styles/utils.scss" as *;
</style>
