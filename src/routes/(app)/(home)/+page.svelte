<script lang="ts">
  import { Button, ButtonGroup, Link, Pager, Panel, Separator } from "titchy";
  import { Hand } from "@lucide/svelte";

  import { query } from "$/client/api";
  import { Question } from "$/components";
  import { LATEST_QUESTIONS_LIMIT } from "$/utils";
  import { m } from "@/paraglide/messages";

  const { data } = $props();

  let page = $state(1);

  const questionsQuery = query(() => ({ method:'GET', path:'/questions/latest', args:{ page } }), data.questions);
  const questions = $derived(questionsQuery.data ?? data.questions);
</script>

<Panel class="top-card" variant="wrapper">
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
  label="$page$"
  min={1} max={Math.ceil(questions.total / LATEST_QUESTIONS_LIMIT)}
  bind:value={page}
/>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  :global
  .titchy.panel.top-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1ch;

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
