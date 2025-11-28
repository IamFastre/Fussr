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
  import { Markdown, Tags } from "$/components";
  import { query } from "$/client/api";

  dayjs.extend(relativeTime);

  const { data } = $props();

  const locale = getLocale();
  const uuid   = $derived(page.params.uuid ?? "");

  const questionQuery = query(() => ({ method:'GET', path:'/questions/[uuid]', params:{ uuid } }), data.question!);

  const question = $derived(questionQuery.data ?? data.question);
  const author   = $derived(question?.author);
  const time     = $derived(dayjs(question?.created_at ?? "").locale(locale));
  const isAuthor = $derived(data.auth.user?.id === question?.author.uuid);

  let vote = $state<'up' | 'down'>();

  const onVoteUp = () => {
    vote = vote === 'up' ? undefined : 'up';
  };

  const onVoteDown = () => {
    vote = vote === 'down' ? undefined : 'down';
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
      <Button variant={vote === 'up' ? 'primary' : 'secondary'} onclick={onVoteUp}>
        <ArrowUp />
      </Button>
      <div class="score">
        <span class="count {question.score > 0 ? 'good' : question.score < 0 ? 'bad' : ''}">
          {question.score.toLocaleString()}
        </span>
        <span class="label">
          {m.question_score()}
        </span>
      </div>
      <Button variant={vote === 'down' ? 'primary' : 'secondary'} onclick={onVoteDown}>
        <ArrowDown />
      </Button>
      <Separator variant="secondary" line="dashed" />
      <ButtonGroup class="actions">
        <Button variant="outline">
          {m.question_follow()}
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
  <Panel class="not-fount">
    <CircleX />
    <span>
      {@html m.questions_not_found({ uuid })}
    </span>
  </Panel>
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

    .sidebar {
      gap: 10px;
      padding: 10px;
      min-width: 75px;
      max-width: 125px;

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
        }
      }

      .titchy.button-group.actions {
        .button {
          flex: 1;
          font-size: 0.66em;
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

  :global
  .titchy.panel.not-fount {
    flex: 1;
    @include flex-center();

    svg {
      color: C(danger);
      @include size(5rem);
    }

    .uuid {
      color: C(accent);
      background-color: C(accent, 10%);
      padding: 2.5px;
      border-radius: 5px;
      font-family: FiraCode;
    }
  }
</style>
