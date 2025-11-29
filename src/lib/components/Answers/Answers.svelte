<script lang="ts">
  import { InputWrapper, Panel, Textarea, Button, Separator, useToaster } from "titchy";

  import { m } from "@/paraglide/messages";
  import type { QuestionPersonal } from "$/utils/types";
  import { api } from "$/client/api";

  interface Props {
    question: QuestionPersonal;
  }

  const { question }: Props = $props();

  const toaster = useToaster();

  let loading     = $state(false);
  let answerInput = $state('');

  const onSubmitAnswer = async () => {
    loading = true;

    const args   = { body:answerInput };
    const params = { uuid:question.uuid };

    const res = await api({ method:'POST', path:'/questions/[uuid]/answer', params, args });

    if (res.error)
      toaster.add({ type: 'error', content: m.generic_error_occurred() });
    else
      answerInput = '';

    loading = false;
  };
</script>

<Panel class="answers">
  <div class="answer-form">
    <InputWrapper label={m.ask_your_answer()} side-actions={{ pastable:'always' }}>
      <Textarea
        bind:value={answerInput}
        placeholder={m.ask_your_answer_placeholder()}
        disabled={loading}
      />
    </InputWrapper>
    <div class="actions">
      <Button scaling={false} onclick={onSubmitAnswer} disabled={loading}>
        {m.ask_submit()}
      </Button>
    </div>
  </div>
  <Separator variant="secondary" line="dashed" />
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
  }
</style>
