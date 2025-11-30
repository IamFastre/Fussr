<script lang="ts">
  import { Button, ButtonGroup, Input, InputWrapper, Link, Pager, Panel, Separator } from "titchy";
  import { Hand, Search } from "@lucide/svelte";

  import { query } from "$/client/api";
  import { Question } from "$/components";
  import { getTagList, LATEST_QUESTIONS_LIMIT } from "$/utils";
  import { m } from "@/paraglide/messages";

  const { data } = $props();

  let page = $state(1);

  const questionsQuery = query(() => ({ method:'GET', path:'/questions/latest', args:{ page } }), data.questions);
  const questions = $derived(questionsQuery.data ?? data.questions);

  let tagSearch = $state('');
</script>

<Panel class="top-card" variant="wrapper">
  <div class="row-items">
    {#if data.user}
      {@const user = data.user}
      <div class="text">
        <div class="welcome">
          <Hand />
          <h2>{@html m.home_greetings({ user:user.display_name ?? user.username })}</h2>
        </div>
        <div class="desc">
          <span>{m.home_greetings_desc()}</span>
        </div>
      </div>
      <div class="actions">
        <Link variant="wrapper" href="/ask">
          <Button variant="secondary">
            {m.ask_ask_question()}
          </Button>
        </Link>
      </div>
    {:else}
      <div class="text">
        <div class="welcome">
          <Hand />
          <h2>{@html m.home_greetings({ user:m.home_oh_visitor() })}</h2>
        </div>
        <div class="desc">
          <span>{m.home_greetings_desc_no_auth()}</span>
        </div>
      </div>
      <div class="actions">
        <ButtonGroup>
          <Link variant="wrapper" href="/auth/sign-in">
            <Button variant="secondary">
              {m.auth_sign_in()}
            </Button>
          </Link>
          <Link variant="wrapper" href="/auth/sign-up">
            <Button variant="secondary">
              {m.auth_sign_up()}
            </Button>
          </Link>
        </ButtonGroup>
      </div>
    {/if}
  </div>
  <div class="search-row">
    <InputWrapper class="search-tags" label={m.ask_tags()} icon={Search}>
      <Input bind:value={tagSearch} placeholder={m.tags_search_placeholder()} />
    </InputWrapper>
    <Link class="search-link" variant="wrapper" href="/tags/{getTagList(tagSearch).join(',')}">
      <Button variant="secondary" scaling={false}>
        <Search />
      </Button>
    </Link>
  </div>
</Panel>

<Separator variant="secondary" />

<div class="questions">
  {#each questions.list as question, i (i)}
    <Question {question} />
  {/each}
</div>

<div class="sep"></div>

<Pager
  class="questions-pager"
  bind:value={page}
  min={1} max={Math.ceil(questions.total / LATEST_QUESTIONS_LIMIT)}
  label="$page$"
/>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  :global
  .titchy.panel.top-card {
    padding: 0;

    .row-items {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 1ch;
      gap: 1ch;
    }

    .search-row {
      flex-direction: row;
      gap: 1ch;

      .titchy.input-wrapper.search-tags {
        flex: 1;

        .label {
          font-size: 0.8rem;
        }
      }

      .search-link {
        min-width: 50px;

        .titchy.button {
          flex: 1;
          svg { @include size(1.5em); }
        }
      }
    }

    .text {
      gap: 0.5ch;

      .welcome {
        flex-direction: row;
        align-items: center;
        gap: 1ch;

        svg {
          @include size(2em);
          color: C(accent);
          animation: wave 750ms ease-in-out infinite;
        }

        .user {
          color: C(accent);
        }
      }

      .desc {
        font-size: 0.85em;
        color: C(secondary, 60%);
      }
    }
  }

  .questions {
    gap: 10px;
  }

  .sep {
    flex: 1;
  }

  :global
  .titchy.pager.questions-pager {
    border: none;
  }

  @keyframes wave {
    0%   { rotate: 60deg; }
    50%  { rotate: 25deg; }
    100% { rotate: 60deg; }
  }
</style>
