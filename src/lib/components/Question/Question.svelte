<script lang="ts">
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import "dayjs/locale/en";
  import "dayjs/locale/ar";

  import { Link, Panel } from "titchy";
  import { Calendar } from "@lucide/svelte";

  import { m } from "@/paraglide/messages";
  import { getLocale } from "@/paraglide/runtime";
  import type { QuestionPublic } from "$/utils/types";
  import { Markdown, Tags } from "$/components"

  dayjs.extend(relativeTime);

  interface Props {
    question: QuestionPublic;
  }

  const { question }: Props = $props();

  const locale = getLocale();

  const author = $derived(question.author);
  const time   = $derived(dayjs(question.created_at).locale(locale));

  const scoreSign = $derived(question.score > 0 ? "+" : question.score < 0 ? "-" : "");
</script>

<Panel class="question" variant="secondary" borderless>
  <div class="props">
    <div class="score">
      <div class="count {question.score > 0 ? 'good' : question.score < 0 ? 'bad' : ''}">
        <span>
          <small>{scoreSign}</small>{Math.abs(question.score).toLocaleString()}
        </span>
      </div>
      <div class="label">
        {m.question_score()}
      </div>
    </div>
    <div class="prop answers">
      <div class="count">
        {question.answers.toLocaleString()}
      </div>
      <div class="label">
        {m.question_answers()}
      </div>
    </div>
    <div class="prop followers">
      <div class="count">
        {question.follows.toLocaleString()}
      </div>
      <div class="label">
        {m.question_followers()}
      </div>
    </div>
  </div>
  <div class="content">
    <Link class="title" variant="wrapper" href="/questions/{question.uuid}">
      {question.title}
    </Link>
    <div class="body">
      <Markdown content={question.body} />
    </div>
    <Tags tags={question.tags} />
    <div class="foot">
      <Link class="author" variant="wrapper" href="/users/{author.username}">
        <img
          src={author.avatar}
          alt="{author.username}'s avatar"
        />
        <span>{author.display_name ?? author.username}</span>
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
  .titchy.panel.question {
    flex-direction: row;
    overflow: hidden;
    padding: 0;
    gap: 0;

    .props {
      flex: 1;
      background-color: C(accent, 10%);
      padding: 10px;
      gap: 5px;
      align-items: stretch;
      font-weight: bold;

      .score {
        align-items: center;
        margin-bottom: 10px;


        .count {
          font-size: 1.5em;
          &.good small { color: C(success); }
          &.bad  small { color: C(danger); }
        }

        .label {
          color: C(accent);
          font-size: 0.75em;
        }
      }

      .prop {
        align-items: center;
        border: 2px solid C(accent, 30%);
        border-radius: 5px;
        padding: 5px;
        flex-direction: row;
        gap: 0.5ch;
        font-size: 0.66em;
        font-weight: bold;

        .count { color: C(accent); }
      }
    }

    .content {
      flex: 9;
      align-items: start;
      padding: 10px;
      gap: 10px;
      min-width: 0;

      .titchy.link.title {
        color: C(accent);
        font-size: 1.25em;
        font-weight: bold;
      }

      .body {
        $b: 10px;

        font-size: 0.85em;
        color: C(secondary, 70%);
        max-height: 200px;
        max-width: 100%;
        mask-image: linear-gradient(to bottom, white calc(100% - $b * 3), transparent calc(100% - $b));
        padding-bottom: $b;
        margin-bottom: -$b;
      }

      .tags {
        flex-direction: row;
        gap: 0.5ch;

        .tag {
          color: C(accent);
          background-color: C(accent, 10%);
          padding: 2.5px 5px;

          font-size: 0.75em;
          border-radius: 5px;
        }
      }

      .foot {
        align-self: stretch;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .author {
          flex-direction: row;
          align-items: center;
          background-color: C(accent, 10%);
          overflow: hidden;
          border-radius: 5px;

          img { @include size(1.5em); }

          span {
            color: C(accent);
            font-size: 0.85em;
            padding: 0 5px;
          }
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
