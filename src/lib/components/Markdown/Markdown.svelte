<script lang="ts">
  import Prism from "prismjs";
  import "prism-svelte";

  import { marked, Renderer, type Tokens } from "marked";

  interface Props {
    content: string;
  }

  const { content }: Props = $props();

  class FussrRenderer extends Renderer {
    code({ lang = "txt", text }: Tokens.Code): string {
      const content = Prism.highlight(text, Prism.languages[lang], lang);
      return `<pre><span class="lang">${lang}</span><code>${content}</code></pre>`;
    }
  }

  const renderer = new FussrRenderer({
    gfm:true,
    breaks:true,
  });
</script>

<div class="markdown">
  {@html marked(content, { renderer })}
</div>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  .markdown {
    flex: 1;
    font-size: 1em;
    line-height: 1.5rem;
    align-items: stretch;
    overflow: hidden;

    :global {
      img {
        max-width: 100%;
        max-height: 100%;
      }

      :not(pre) code {
        padding: 2.5px 5px;
        border-radius: 5px;
        background-color: C(secondary, 10%);
      }

      pre {
        background-color: C(secondary, 10%);
        border-radius: 5px;
        padding: 5px;

        span.lang {
          color: C(accent);
          font-family: FiraCode;
          font-size: smaller;
        }

        code {
          display: block;
          overflow-x: auto;
          @include hide-scrollbar();
        }
      }
    }
  }
</style>
