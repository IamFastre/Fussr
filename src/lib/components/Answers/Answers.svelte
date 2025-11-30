<script lang="ts">
  import { InputWrapper, Panel, Textarea, Button, Separator, useToaster } from "titchy";

  import { m } from "@/paraglide/messages";
  import type { QuestionPersonal } from "$/utils/types";
  import { api, query } from "$/client/api";
  import { Answer } from "$/components";

  interface Props {
    question: QuestionPersonal;
  }

  const { question }: Props = $props();

  const toaster = useToaster();

  let submitting  = $state(false);
  let page        = $state(1);
  let answerInput = $state('');

  const answersQuery = query(() => ({
    method: 'GET',
    path: '/questions/[uuid]/answers',
    params: { uuid:question.uuid },
    args: { page }
  }));

  const answers = $derived(answersQuery.data ?? { list:[], total:0 });

  const onSubmitAnswer = async () => {
    submitting = true;

    const args   = { body:answerInput };
    const params = { uuid:question.uuid };

    const res = await api({ method:'POST', path:'/questions/[uuid]/answer', params, args });
    await answersQuery.refetch();

    if (res.error)
      toaster.add({ type: 'error', content: m.generic_error_occurred() });
    else
      answerInput = '';

    submitting = false;
  };
</script>

<Panel class="answers">
  <div class="answer-form">
    <InputWrapper label={m.ask_your_answer()} side-actions={{ pastable:'always' }}>
      <Textarea
        bind:value={answerInput}
        placeholder={m.ask_your_answer_placeholder()}
        disabled={submitting}
      />
    </InputWrapper>
    <div class="actions">
      <Button scaling={false} onclick={onSubmitAnswer} disabled={submitting}>
        {m.ask_submit()}
      </Button>
    </div>
  </div>
  {#if answers.total}
    <Separator variant="secondary" line="dashed" />
  {/if}
  <div class="answer-array">
    {#each answers.list as answer}
      <Answer {answer} {question} onVote={async () => void await answersQuery.refetch()} />
    {/each}
  </div>
</Panel>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  :global
  .titchy.panel.answers {
    .answer-form {
      gap: 10px;

      textarea.titchy.input {
        font-family: FiraCode;
        height: 200px;
        max-height: unset;
      }

      > .actions {
        flex-direction: row;
        > .titchy.button {
          width: 175px;
        }
      }
    }

    .answer-array {
      gap: 10px;
    }
  }
</style>
