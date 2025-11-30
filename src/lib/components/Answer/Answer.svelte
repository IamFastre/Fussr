<script lang="ts">
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import "dayjs/locale/en";
  import "dayjs/locale/ar";

  import { Button, ButtonGroup, Link, Panel } from "titchy";
  import { ArrowDown, ArrowUp, Calendar, Check, Pencil, Trash } from "@lucide/svelte";

  import { m } from "@/paraglide/messages";
  import { getLocale } from "@/paraglide/runtime";
  import type { AnswerPersonal, QuestionPublic, VoteDirection } from "$/utils/types";
  import { Markdown } from "$/components";
  import { page } from "$app/state";
  import { api } from "$/client/api";

  dayjs.extend(relativeTime);

  interface Props {
    answer:   AnswerPersonal;
    question: QuestionPublic;
    onVote?:  () => Promise<void>;
  }

  const { answer, question, onVote: onAfterVote }: Props = $props();

  const locale = getLocale();

  const author    = $derived(answer.author);
  const isAsker   = $derived(page.data.auth.user?.id === question.author.uuid);
  const isAuthor  = $derived(page.data.auth.user?.id === author.uuid);
  const vote      = $derived<VoteDirection>(answer?.vote ?? 'none');
  const time      = $derived(dayjs(answer.created_at).locale(locale));
  const scoreSign = $derived(answer.score > 0 ? "+" : answer.score < 0 ? "-" : "");

  let loading = $state<boolean>(false);

  const onVote = (dir: 'up' | 'down') => async () => {
    loading = true;

    const args   = { vote: vote === dir ? 'none' : dir } as const;
    const params = { uuid: answer.uuid };

    if (vote !== 'none')
      await api({ method:'POST', path:'/answers/[uuid]/vote', params, args:{ vote:'none' } });

    if (args.vote !== 'none')
      await api({ method:'POST', path:'/answers/[uuid]/vote', params, args });

    await onAfterVote?.();
    loading = false;
  };
</script>

<Panel class="answer" variant="secondary" borderless>
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
    {#if isAsker}
      <Button variant="primary" class="solution">
        <Check />
        Solution
      </Button>
    {/if}
    {#if isAuthor}
      <div class="author-actions">
        <Button variant="outline">
          <Trash />
        </Button>
        <Button variant="outline">
          <Pencil />
        </Button>
      </div>
    {/if}
  </div>
  <div class="content">
    <div class="body">
      <Markdown content={answer.body} />
    </div>
    <div class="foot">
      <Link class="author" variant="wrapper" href="/users/{author.username}">
        <img
          src={author.avatar}
          alt="{author.avatar}'s avatar"
        />
        <span>
          {author.display_name ?? author.username}
        </span>
      </Link>
      <div class="timestamp" title="{time.format()}">
        <Calendar />
        <time datetime="{time.toISOString()}">{time.fromNow()}</time>
      </div>
    </div>
  </div>
</Panel>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  :global
  .titchy.panel.answer {
    flex-direction: row;

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
        gap: 10px;

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
</style>
