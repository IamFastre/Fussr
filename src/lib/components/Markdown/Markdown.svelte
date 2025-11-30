<script lang="ts">
  import "prismjs";
  import { AutoLoader } from 'svelte-prism-autoloader';
  import "prism-svelte";

  import _ from "lodash";
  import { marked, Renderer, type Tokens } from "marked";

  interface Props {
    content: string;
  }

  let { content }: Props = $props();

  const code = (lang: string, content: string) => (
    `<pre><span class="lang">${lang.toUpperCase()}</span><code class="language-${lang}">${content}</code></pre>`
  );

  class FussrRenderer extends Renderer {
    code({ lang = "txt", text }: Tokens.Code): string {
      return code(lang, _.escape(text));
    }
  }

  const renderer = new FussrRenderer({
    gfm:true,
    breaks:true,
  });
</script>


<div class="markdown">
  {@html marked(content, { renderer })}
  <AutoLoader autoHighlightAll />
</div>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  .markdown {
    flex: 1;
    font-size: 1em;
    line-height: 1.5rem;
    align-items: stretch;
    overflow: hidden;
    gap: 0.75em;
    word-break: break-all;
    word-break: break-word;

    :global {
      hr {
        margin: 0;
        width: 100%;
        border: none;
        border-top: 2px solid C(accent);
        border-radius: 2px;
      }

      img {
        max-width: 100%;
        max-height: 100%;
      }

      :not(pre) code {
        direction: ltr;
        padding: 1px 5px;
        border-radius: 5px;
        background-color: C(secondary, 10%);
      }

      pre {
        direction: ltr;
        background-color: C(secondary, 10%);
        border-radius: 5px;
        padding: 5px;
        font-size: smaller;
        font-family: FiraCode;

        span.lang { color: C(accent); }

        code {
          display: block;
          overflow-x: auto;
          @include hide-scrollbar();
        }
      }
    }
  }
</style>
