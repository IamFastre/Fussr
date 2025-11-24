<script lang="ts">
  import { Archive, Ban, Plus, X } from "@lucide/svelte";
  import { scale } from "svelte/transition";
  import { Button, Input, InputWrapper, Label, Panel, Separator, Textarea } from "titchy";

  let titleInput = $state<string>("");
  let bodyInput  = $state<string>("");
  let tagInput   = $state<string>("");

  let tags = $state<string[]>([]);

  const addTag = () => {
    const tagsToAdd = tagInput.split(/,\s*/).map(t => t.trim());

    for (let tag of tagsToAdd) if (tag) {
      tag = tag
        .replace(/[^a-z0-9]/gi, '-')
        .replace(/(^-)|(-$)/g, "")
        .toLowerCase();

      if (tag.length > 1 && tags.length < 6 && !tags.includes(tag)) {
        tags.push(tag);
        tagInput = "";
      }
    }
  };

  const remTag = (tag: string) => () => {
    tags = tags.filter(t => t !== tag);
  };
</script>

<div class="ask">
  <div class="form">
    <Panel>
      <h2>Ask a question</h2>
      <Label for="title">
        <InputWrapper label="Title">
          <Input
            bind:value={titleInput}
            id="title"
            placeholder="Describe your problem briefly."
          />
        </InputWrapper>
      </Label>

      <Label for="body">
        <InputWrapper
          label="Body"
          side-actions={{ clearable:'always', pastable:'hover' }}
        >
          <Textarea
            bind:value={bodyInput}
            id="body"
            placeholder="Give every detail you can give about the problem."
          />
        </InputWrapper>
      </Label>

      <Label class="tags-label" for="tags">
        <Panel variant="secondary">
          <span class="label-title">Tags</span>
          <span class="label-desc">Categorize your question by adding upto 6 tags.</span>
          <div class="tag-array">
            {#each tags as tag, i (i)}
              <div transition:scale>
                <Button class="tag" variant="wrapper" onclick={remTag(tag)}>
                  <span>#{tag}</span>
                  <X />
                </Button>
              </div>
            {:else}
              <div class="no-tag">
                <Ban />
                <span>No tags selected.</span>
              </div>
            {/each}
            {#if tags.length}
              <div class="sep"></div>
              <Button variant="wrapper" onclick={() => tags = []}>
                <X />
              </Button>
            {/if}
          </div>
          <div class="input-row">
            <Input
              bind:value={tagInput}
              id="tags"
              placeholder="eg. react, nextjs, c-sharp or linux."
              disabled={tags.length >= 6}
              onkeydown={e => {
                if (e.key === 'Enter')
                  addTag()

                if (e.key === 'Backspace' && tagInput.length === 0)
                  if (e.shiftKey) remTag(tags[0])()
                  else remTag(tags[tags.length - 1])()
              }}
            />
            <Button onclick={addTag} disabled={tags.length >= 6}>
              <Plus />
            </Button>
          </div>
        </Panel>
      </Label>

      <Separator variant="secondary" />

      <div class="actions">
        <Button class="big" scaling={false}>
          Submit
        </Button>
        <Button class="small" variant="secondary" scaling={false}>
          <Archive />
          <span class="title">
            Draft
          </span>
        </Button>
      </div>
    </Panel>
  </div>
</div>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  .ask {
    .form {
      @include wide-screen { margin: 0 7.5%; }
      :global
      .titchy.label {
        .label-title {
          color: C(accent);
          font-weight: bold;
        }

        .label-desc {
          color: C(secondary, 15%);
          font-weight: 500;
          font-size: smaller;
        }

        .input-row {
          flex-direction: row;
          align-items: center;
          gap: 10px;

          .input { flex: 1; }
        }

        textarea.titchy.input {
          height: 350px;
          max-height: 100dvh;
        }

        &.tags-label {
          .tag-array {
            font-size: smaller;
            gap: 7.5px;
            padding: 7.5px;
            border-radius: 10px;
            background-color: C(accent, 5%);
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;

            .titchy.button.tag {
              flex-direction: row;
              align-items: center;
              gap: 0.5ch;
              color: C(accent);
              padding: 5px;
              border-radius: 10px;
              background-color: C(accent, 10%);

              svg { @include size(1em); }
            }

            .no-tag {
              flex-direction: row;
              align-items: center;
              gap: 1ch;
              color: C(secondary);
              opacity: 0.3;
              font-style: italic;
            }

            .sep { flex: 1; }
          }
        }
      }

      .actions {
        flex-direction: row;
        gap: 0.75em;

        :global
        .titchy.button {
          svg { @include size(1.5em, 'all'); }

          &.big {
            width: 175px;
          }

          &.small {
            $g: 1ch;
            justify-content: start;
            min-width: fit-content;
            gap: $g;
            overflow: hidden;

            .title {
              opacity: 0;
              width: 0;
              margin-inline-start: calc(-1 * $g);
            }

            &:hover {
              .title {
                opacity: 1;
                width: auto;
                margin-inline-start: 0;
              }
            }
          }
        }
      }
    }
  }
</style>
