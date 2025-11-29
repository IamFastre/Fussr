<script lang="ts">
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import "dayjs/locale/en";
  import "dayjs/locale/ar";

  import { page } from '$app/state';
  import { ArrowDown, ArrowUp, Calendar, CircleX, Pencil, Share, Trash } from '@lucide/svelte';
  import { Button, ButtonGroup, Link, Panel, Separator } from 'titchy';

  import { m } from '@/paraglide/messages';
  import { getLocale } from "@/paraglide/runtime";
  import { Markdown, NotFound, Tags } from "$/components";
  import { api, query } from "$/client/api";
  import type { VoteDirection } from "$/utils/types";

  dayjs.extend(relativeTime);

  const { data } = $props();

  const locale = getLocale();
  const uuid   = $derived(page.params.uuid ?? "");

  const questionQuery = query(() => ({ method:'GET', path:'/questions/[uuid]', params:{ uuid } }), data.question!);

  const question = $derived(questionQuery.data ?? data.question);
  const author   = $derived(question?.author);
  const time     = $derived(dayjs(question?.created_at ?? "").locale(locale));
  const isAuthor = $derived(data.auth.user?.id === question?.author.uuid);

  let vote    = $derived<VoteDirection>(question?.vote ?? 'none');
  let follow  = $derived<boolean>(!!question?.follow);
  let loading = $state<boolean>(false);

  const onVote = (dir: 'up' | 'down') => async () => {
    loading = true;

    const args   = { vote: vote === dir ? 'none' : dir } as const;
    const params = { uuid };

    if (vote !== 'none')
      await api({ method:'POST', path:'/questions/[uuid]/vote', params, args:{ vote:'none' } });

    if (args.vote !== 'none')
      await api({ method:'POST', path:'/questions/[uuid]/vote', params, args });

    await questionQuery.refetch();
    loading = false;
  };

  const onFollow = async () => {
    loading = true;

    const params = { uuid };
    await api({ method:'POST', path:'/questions/[uuid]/follow', params });

    await questionQuery.refetch();
    loading = false;
  };
</script>

{#if question}
  <Panel class="question-title" variant="secondary" borderless>
    <h2>{question.title}</h2>
    <Separator variant="secondary" line="dashed" />
    <div class="title-foot">
      {#if author}
        <Link class="author" variant="wrapper" href="/users/{author.username}">
          <img
            src={author.avatar}
            alt="{author.username}'s avatar"
          />
          <span>{author.display_name ?? author.username}</span>
        </Link>
      {/if}
      <div class="timestamp" title="{time.format()}">
        <Calendar />
        <time datetime="{time.toISOString()}">{time.fromNow()}</time>
      </div>
    </div>
  </Panel>

  <Panel class="question-body">
    <div class="sidebar">
      <Button variant={vote === 'up' ? 'primary' : 'secondary'} onclick={onVote('up')} disabled={loading}>
        <ArrowUp />
      </Button>
      <div class="score">
        <span class="count {question.score > 0 ? 'good' : question.score < 0 ? 'bad' : ''}">
          <small>{question.score > 0 ? '+' : question.score < 0 ? '-' : ''}</small>{Math.abs(question.score).toLocaleString()}
        </span>
        <span class="label">
          {m.question_score()}
        </span>
      </div>
      <Button variant={vote === 'down' ? 'primary' : 'secondary'} onclick={onVote('down')} disabled={loading}>
        <ArrowDown />
      </Button>
      <Separator variant="secondary" line="dashed" />
      <ButtonGroup class="actions">
        <Button variant="outline" onclick={onFollow} disabled={loading}>
          {follow ? m.question_following() : m.question_follow()}
        </Button>
        <Button variant="outline">
          <Share />
        </Button>
      </ButtonGroup>
      {#if isAuthor}
        <ButtonGroup class="actions">
          <Button variant="outline">
            <Trash />
          </Button>
          <Button variant="outline">
            <Pencil />
          </Button>
        </ButtonGroup>
      {/if}
      <div class="props">
        <div class="prop answers">
          <span class="count">
            {question.answers.toLocaleString()}
          </span>
          <span class="label">
            {m.question_answers()}
          </span>
        </div>
        <div class="prop follows">
          <span class="count">
            {question.follows.toLocaleString()}
          </span>
          <span class="label">
            {m.question_followers()}
          </span>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="body">
        <Markdown content={question.body} />
      </div>
      <Tags tags={question.tags} />
    </div>
  </Panel>
{:else}
  <NotFound message={m.questions_not_found({ uuid })} />
{/if}

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  :global
  .titchy.panel.question-title {
    padding: 15px;
    gap: 15px;

    .title-foot {
      flex-direction: row;
      align-items: center;
      gap: 2ch;

      > * {
        flex-direction: row;
        align-items: center;
        gap: 0.5ch;

        font-size: 0.85em;

        img { border-radius: 15%; }

        img, svg {
          @include size(1.33em);
          color: C(accent);
        }

        span {
          color: C(accent);
        }
      }
    }
  }

  :global
  .titchy.panel.question-body {
    flex: 1;
    flex-direction: row;

    padding: 0;
    gap: 0;

    // @include small-screen {
    //   flex-direction: column;
    // }

    .sidebar {
      gap: 10px;
      padding: 10px;
      min-width: 75px;
      max-width: 120px;

      // @include small-screen {
      //   flex-direction: row;
      //   width: 100%;
      //   max-width: unset;

      //   hr.titchy.separator { display: none; }

      //   .titchy.button-group.actions {
      //     flex: 1;
      //   }

      //   .props {
      //     justify-content: center;
      //   }
      // }

      .score {
        align-items: center;

        .count {
          font-size: 1.5em;
          font-weight: bold;

          &.good { color: C(success); }
          &.bad  { color: C(danger);  }
        }

        .label {
          font-size: 0.75em;
          margin-top: -5px;
        }
      }

      .titchy.button-group.actions {
        .button {
          flex: 1;
          font-size: 0.66em;
          text-align: center;
          @include size(unset, 'min');

          svg {
            @include size(1.25em);
          }
        }
      }

      .props {
        gap: 5px;

        .prop {
          flex-direction: row;
          gap: 0.5ch;
          font-size: 0.66em;

          .label { color: C(accent); }
        }
      }
    }

    .content {
      flex: 1;
      min-width: 0;
      padding: 10px;
      gap: 10px;
    }
  }
</style>
