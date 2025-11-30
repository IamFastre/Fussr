<script lang="ts">
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import "dayjs/locale/en";
  import "dayjs/locale/ar";

  import { Button, ButtonGroup, Link, Overlay, Panel, Separator, useToaster } from "titchy";
  import { ArrowDown, ArrowUp, Calendar, Check, CircleCheckBig, Pencil, Trash } from "@lucide/svelte";

  import { m } from "@/paraglide/messages";
  import { getLocale } from "@/paraglide/runtime";
  import type { AnswerPersonal, AnswerPublic, QuestionPublic, VoteDirection } from "$/utils/types";
  import { Markdown } from "$/components";
  import { page } from "$app/state";
  import { api } from "$/client/api";

  dayjs.extend(relativeTime);

  interface Props {
    answer:      AnswerPersonal | AnswerPublic;
    question:    QuestionPublic;
    authorless?: boolean;
    refetch?:    () => Promise<void>;
  }

  const { answer, question, authorless, refetch }: Props = $props();

  const toaster = useToaster();
  const locale = getLocale();

  const author    = $derived(answer.author);
  const isAsker   = $derived(page.data.auth.user?.id === question.author.uuid);
  const isAuthor  = $derived(page.data.auth.user?.id === author.uuid);
  const vote      = $derived<VoteDirection | undefined>((answer as AnswerPersonal).vote ? (answer as AnswerPersonal).vote : undefined);
  const time      = $derived(dayjs(answer.created_at).locale(locale));
  const scoreSign = $derived(answer.score > 0 ? "+" : answer.score < 0 ? "-" : "");

  let isDeleting = $state<boolean>(false);
  let loading    = $state<boolean>(false);

  const onVote = (dir: 'up' | 'down') => async () => {
    loading = true;

    const args   = { vote: vote === dir ? 'none' : dir } as const;
    const params = { uuid: answer.uuid };

    if (vote !== 'none')
      await api({ method:'POST', path:'/answers/[uuid]/vote', params, args:{ vote:'none' } });

    if (args.vote !== 'none')
      await api({ method:'POST', path:'/answers/[uuid]/vote', params, args });

    await refetch?.();
    loading = false;
  };

  const onDelete = async () => {
    if (!isDeleting)
      return;

    loading = true;

    const params = { uuid: answer.uuid };
    const res = await api({ method:'POST', path:'/answers/[uuid]/delete', params });

    if (res.error)
      toaster.add({ type: 'error', content: m.generic_error_occurred() });

    await refetch?.();
    isDeleting = false;
    loading = false;
 };

  const onMarkSolution = async () => {
    loading = true;
    const params = { uuid: answer.uuid };
    const res = await api({ method:'POST', path:'/answers/[uuid]/mark-solution', params });

    if (res.error)
      toaster.add({ type: 'error', content: m.generic_error_occurred() });

    await refetch?.();
    loading = false;
  };
</script>

<Panel class={["answer", { solution:answer.is_solution }]} variant="secondary" borderless={!answer.is_solution}>
  {#if !authorless}
    <div class="side-actions">
      <Button class="up" variant={vote === 'up' ? 'primary' : 'secondary'} onclick={onVote('up')} disabled={loading}>
        <ArrowUp />
      </Button>
      <div class="score {answer.score > 0 ? 'good' : answer.score < 0 ? 'bad' : ''}">
        <span class="count">
          <small>{scoreSign}</small>{Math.abs(answer.score).toLocaleString()}
        </span>
      </div>
      <Button class="down" variant={vote === 'down' ? 'primary' : 'secondary'} onclick={onVote('down')} disabled={loading}>
        <ArrowDown />
      </Button>
      {#if answer.is_solution}
        <div class="answer-check" title={m.ask_solution()}>
          <CircleCheckBig />
        </div>
      {/if}
      {#if isAsker}
        {#if !answer.is_solution}
          <Button variant="primary" class="solution" onclick={onMarkSolution} disabled={loading}>
            <Check />
            {m.ask_solution()}
          </Button>
        {/if}
      {/if}
      {#if isAuthor}
        <div class="author-actions">
          <Button variant="outline" onclick={() => isDeleting =! isDeleting}>
            <Trash />
          </Button>
          <Button variant="outline" disabled>
            <Pencil />
          </Button>
        </div>
      {/if}
    </div>
  {/if}
  <div class="content">
    {#if authorless}
      <Link class="question-title" variant="wrapper" href="/questions/{question.uuid}">
        <span>
          {question.title}
        </span>
      </Link>
      <Separator variant="secondary" line="dashed" />
    {/if}
    <div class="body">
      <Markdown content={answer.body} />
    </div>
    <div class="foot">
      {#if !authorless}
        <Link class="author" variant="wrapper" href="/users/{author.username}">
          <img
            src={author.avatar}
            alt="{author.avatar}'s avatar"
          />
          <span>
            {author.display_name ?? author.username}
          </span>
        </Link>
      {:else}
        <div></div>
      {/if}
      <div class="timestamp" title="{time.format()}">
        <Calendar />
        <time datetime="{time.toISOString()}">{time.fromNow()}</time>
      </div>
    </div>
  </div>
</Panel>

<Overlay class="confirm-delete" bind:active={isDeleting} fill="fixed" center>
  <Panel centered>
    <div class="icon">
      <Trash />
    </div>
    <div class="text">
      <h3>{m.ask_are_you_sure()}</h3>
      <span>{m.ask_are_you_sure_desc()}</span>
    </div>
    <div class="delete-actions">
      <Button onclick={onDelete} disabled={loading}>
        {m.generic_confirm()}
      </Button>
      <Button onclick={() => isDeleting = false}>
        {m.generic_cancel()}
      </Button>
    </div>
  </Panel>
</Overlay>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  :global
  .titchy.panel.answer {
    flex-direction: row;

    &.solution {
      --panel-accent-color: #{C(success)};
      border-width: 3px;
      border-color: C(success, 75%);
      background-color: C(success, 25%);
    }

    > .side-actions {
      align-items: stretch;
      gap: 10px;

      .score {
        align-items: center;

        &.good { color: C(success); }
        &.bad  { color: C(danger);  }
      }

      .titchy.button {
        box-shadow: none;

        &.up, &.down {
          --button-accent-color: #{C(secondary)};

          &.primary.up   { --button-accent-color: #{C(success)}; }
          &.primary.down { --button-accent-color: #{C(danger)};  }
        }
      }

      .answer-check {
        @include flex-center();
        padding: 5px;
        background-color: C(success);
        border-radius: 10px;

        svg {
          color: C(primary);
          @include size(1.5em);
        }
      }

      .solution {
        flex-direction: column;
        font-size: 0.66em;

        svg {
          stroke-width: 3px;
        }
      }

      .author-actions {
        align-self: stretch;
        align-items: stretch;
        gap: 5px;

        .titchy.button {
          @include size(auto, 'all');
          svg { @include size(1em); }
        }
      }
    }

    > .content {
      flex: 1;
      justify-content: space-between;
      gap: 10px;
      min-width: 0;

      .question-title {
        color: C(accent);
        font-weight: bold;
        font-size: 1.25em;
      }

      .foot {
        flex-direction: row;
        align-items: end;
        justify-content: space-between;
        gap: 10px;

        .titchy.link.author {
          flex-direction: row;
          align-items: center;

          overflow: hidden;
          color: C(accent);
          background-color: C(accent, 10%);
          border-radius: 5px;

          img { @include size(1.5em); }
          span { padding: 0 5px; font-size: 0.85em; }
        }

        .timestamp {
          flex-direction: row;
          align-items: center;
          gap: 0.5ch;

          color: C(secondary, 70%);
          font-size: 0.66em;

          svg { @include size(1.25em); }
        }
      }
    }
  }

  :global
  .titchy.overlay.confirm-delete {
    .titchy.panel {
      min-width: min(300px, 80dvw);
    }

    .icon svg {
      color: C(danger);
      @include size(3em);
    }

    .text {
      align-items: center;
      gap: 5px;

      span {
        font-size: 0.8em;
        color: C(secondary, 70%);
      }
    }

    .delete-actions {
      flex-direction: row;
      gap: 10px;

      .titchy.button {
        min-width: min(150px, 30dvw);
        &:first-of-type {
          --button-accent-color: #{C(danger)};
        }
      }
    }
  }
</style>
