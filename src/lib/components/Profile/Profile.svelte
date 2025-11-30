<script lang="ts">
  import { Button, ButtonGroup, Loading, Pager, Panel } from "titchy";
  import { AtSign, Earth, Clock, HeartCrack } from "@lucide/svelte";

  import { m } from "@/paraglide/messages";
  import { getLocale } from "@/paraglide/runtime";
  import { COUNTRIES, entries, LATEST_QUESTIONS_LIMIT } from "$/utils";
  import type { UserPublic } from "$/utils/types";
  import { query } from "$/client/api";
  import { Answer, NotFound, Question } from "$/components";
  import { page } from "$app/state";
  import type { Snippet } from "svelte";

  interface Props {
    user: UserPublic | null;
  }

  const { user:userInit }: Props = $props();

  type Tabs = {
    [K: string]: {
      name: string;
      snippet: Snippet;
    }
  }

  const TABS = {
    questions: { name: m.profile_questions(), snippet: questions, },
    answers: { name: m.profile_answers(), snippet: answers, },
    votes: { name: m.profile_votes(), snippet: votes, },
  } satisfies Tabs;

  const userQuery = query({ method:'GET', path:'/users/[username]', params:{ username:userInit?.username! } }, userInit!);

  const pages = $state({
    questions: 1,
    answers:   1,
    votes:     1,
  });

  const queries = {
    questions: query(
      () => ({
        method: 'GET',
        path: '/users/[username]/questions',
        params: { username:userInit?.username! },
        args: { page:pages.questions }
      }),
      undefined,
      { enabled:false }
    ),

    answers: query(
      () => ({
        method: 'GET',
        path: '/users/[username]/answers',
        params: { username:userInit?.username! },
        args: { page:pages.answers }
      }),
      undefined,
      { enabled:false }
    ),

    votes: query(
      () => ({
        method: 'GET',
        path: '/users/[username]/votes',
        params: { username:userInit?.username! },
        args: { page:pages.votes }
      }),
      undefined,
      { enabled:false }
    ),
  }

  const locale = getLocale();

  let curTab   = $state<keyof typeof TABS>('questions');
  const user   = $derived(userQuery.data ?? userInit);

  $effect(() => {
    queries[curTab].refetch();
  })
</script>

{#snippet questions()}
  {@const query = queries['questions']}
  {@const total = query.data?.total ?? 0}

  {#if query.isLoading}
    <Loading flexible />
  {:else}
    {#each query.data?.list as question, i (i)}
      <Question {question} authorless />
    {:else}
      <div class="no-items">
        <HeartCrack />
        <span>{m.profile_nothing_yet()}</span>
      </div>
    {/each}
  {/if}
  <div class="sep"></div>
  <Pager
    bind:value={pages.questions}
    min={1} max={Math.ceil(total / LATEST_QUESTIONS_LIMIT)}
    label="$page$"
  />
{/snippet}

{#snippet answers()}
  {@const query = queries['answers']}
  {@const total = query.data?.total ?? 0}

  {#if query.isLoading}
    <Loading flexible />
  {:else}
    {#each query.data?.list as answer, i (i)}
      <Answer {answer} question={answer.question} authorless />
    {:else}
      <div class="no-items">
        <HeartCrack />
        <span>{m.profile_nothing_yet()}</span>
      </div>
    {/each}
  {/if}
  <div class="sep"></div>
  <Pager
    bind:value={pages.questions}
    min={1} max={Math.ceil(total / LATEST_QUESTIONS_LIMIT)}
    label="$page$"
  />
{/snippet}

{#snippet votes()}
  {@const query = queries['votes']}
  {@const total = query.data?.total ?? 0}

  {#if query.isLoading}
    <Loading flexible />
  {:else}
    {#each query.data?.list as vote, i (i)}
      <Question question={vote.question} my-vote={vote.sign} bodyless />
    {:else}
      <div class="no-items">
        <HeartCrack />
        <span>{m.profile_nothing_yet()}</span>
      </div>
    {/each}
  {/if}
  <div class="sep"></div>
  <Pager
    bind:value={pages.questions}
    min={1} max={Math.ceil(total / LATEST_QUESTIONS_LIMIT)}
    label="$page$"
  />
{/snippet}

{#if user}
  <Panel variant="secondary" class="info-card" borderless>
    <div class="avatar">
      <img
        src={user.avatar}
        alt="My avatar"
      />
    </div>
    <div class="info">
      <div class="names">
        <span class="displayname">{user.display_name ?? user.username}</span>
        <div class="username">
          <AtSign />
          <span>
            {user.username}
          </span>
        </div>
      </div>
      {#if user.bio}
        <span class="bio">
          {user.bio}
        </span>
      {/if}
      <div class="props">
        {#if user.country}
          {@const country = COUNTRIES[user.country as keyof typeof COUNTRIES]}
          {@const name = country.name[locale] ?? country.name['en']}
          <div class="prop since">
            <Earth />
            <span>{name}</span>
            <img
              src="https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/{user.country}.svg"
              alt={country.emoji}
            />
          </div>
        {/if}
        <div class="prop since">
          <Clock />
          <span>{new Date(user.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  </Panel>

  <Panel class="activity-card">
    <ButtonGroup class="activity-buttons">
      {#each entries(TABS) as [id, info], i (i)}
        <Button
          variant={id === curTab ? "primary" : "secondary"}
          onclick={() => curTab = id}
          rounded
        >
          {info.name}
        </Button>
      {/each}
    </ButtonGroup>
    {@render TABS[curTab].snippet()}
  </Panel>
{:else}
  <NotFound message={m.user_not_found({ user:page.params.username ?? '' })} />
{/if}

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  :global
  .titchy.panel.info-card {
    flex-direction: row;
    align-items: stretch;
    justify-content: start;
    gap: 1em;
  }

  .avatar {
    @include flex-center();
    @include size(150px);

    img {
      @include width(100%);
      border-radius: 10px;
    }
  }

  .info {
    flex-direction: column;
    justify-content: start;
    gap: 0.5em;
    margin: 1em 0;

    .names {
      .displayname {
        font-size: 1.5em;
        font-weight: bold;
      }

      .username {
        flex-direction: row;
        align-items: center;
        gap: 0.15em;

        color: C(secondary);
        opacity: 0.35;
        font-family: FiraCode;
        font-size: 0.8em;

        :global(svg) { @include size(0.85em); stroke-width: 3px; }
        span { user-select: all; }
      }
    }

    .bio {
      font-size: 0.85em;
      color: C(secondary, 50%);
    }

    .props {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: stretch;
      gap: 0.5em;
      font-size: 0.85em;

      .prop {
        flex-direction: row;
        align-items: center;
        gap: 0.33em;

        background-color: C(accent, 15%);
        padding: 2.5px 5px;
        border-radius: 10px;

        :global(svg) {
          @include size(1em);
          color: C(accent);
          stroke-width: 3px;
        }

        span {
          user-select: all;
          color: C(secondary, 50%);
        }

        img {
          @include size(1.5em);
        }
      }
    }
  }

  :global
  .titchy.panel.activity-card {
    flex: 1;
    padding: 10px;
    overflow: hidden;

    .activity-buttons {
      flex-direction: row;
      padding: 7.5px;
      background-color: C(accent, 10%);
      border-radius: 15px;

      .titchy.button {
        @include size(auto, 'all');
        flex: 1;
        font-size: 0.75em;
      }
    }

    .sep { flex: 1; }

    .no-items {
      flex: 1000;
      @include flex-center();
      color: C(accent);
      gap: 10px;
      opacity: 0.35;

      svg {
        @include size(3em);
      }
    }
  }
</style>
