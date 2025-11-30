<script lang="ts">
  import { scale } from "svelte/transition";
  import { Button, Input, InputWrapper, Label, Panel, Separator, Textarea, useToaster } from "titchy";
  import { Archive, Ban, CircleQuestionMark, Plus, X } from "@lucide/svelte";

  import { m } from "@/paraglide/messages";
  import { api } from "$/client/api";
  import { QuestionForm } from "$/utils/zod/forms";
  import { goto } from "$app/navigation";

  const toaster = useToaster();

  let titleInput = $state<string>("");
  let bodyInput  = $state<string>("");
  let tagInput   = $state<string>("");

  let loading = $state(false);
  let tags    = $state<string[]>([]);

  const addTag = () => {
    const tagsToAdd = tagInput.split(/,\s*/).map(t => t.trim());

    for (let tag of tagsToAdd) if (tag) {
      tag = tag
        .replace(/[^a-z0-9]/gi, '-')
        .replace(/(^-)|(-$)/g, "")
        .toLowerCase();

      if (tags.length < 6 && !tags.includes(tag)) {
        tags.push(tag);
        tagInput = "";
      }
    }
  };

  const remTag = (tag: string) => () => {
    tags = tags.filter(t => t !== tag);
  };

  const onSubmit = async () => {
    loading = true;
    const { success, data, error } = QuestionForm.safeParse({ title: titleInput, body: bodyInput, tags });

    if (success) {
      const res = await api({ method:'POST', path:'/questions/ask', args:data });

      if (res.data)
        goto(`/questions/${res.data.uuid}`);
      else
        toaster.add({ type: 'error', content: m.generic_error_occurred() });
    }

    else {
      // TODO: add proper errors like in auth pages
      toaster.add({ type: 'error', content: m.generic_error_occurred() });
      console.error(error);
    }

    loading = false;
  };
</script>

<Panel class="form">
  <h2>
    <CircleQuestionMark />
    {m.ask_ask_question()}
  </h2>
  <Label for="title">
    <InputWrapper label={m.ask_title()}>
      <Input
        bind:value={titleInput}
        id="title"
        placeholder={m.ask_title_placeholder()}
        disabled={loading}
      />
    </InputWrapper>
  </Label>

  <Label for="body">
    <InputWrapper
      label={m.ask_body()}
      side-actions={{ clearable:'always', pastable:'hover' }}
    >
      <Textarea
        bind:value={bodyInput}
        id="body"
        placeholder={m.ask_body_placeholder()}
        disabled={loading}
      />
    </InputWrapper>
  </Label>

  <Label class={["tags-label", { disabled:loading }]} for="tags">
    <Panel variant="secondary">
      <span class="label-title">{m.ask_tags()}</span>
      <span class="label-desc">{m.ask_tags_description()}</span>
      <div class="tag-array">
        {#each tags as tag, i (i)}
          <div transition:scale>
            <Button class="tag" variant="wrapper" onclick={remTag(tag)} disabled={loading}>
              <span>#{tag}</span>
              <X />
            </Button>
          </div>
        {:else}
          <div class="no-tag">
            <Ban />
            <span>{m.ask_tags_empty()}</span>
          </div>
        {/each}
        {#if tags.length}
          <div class="sep"></div>
          <Button variant="wrapper" onclick={() => tags = []} disabled={loading}>
            <X />
          </Button>
        {/if}
      </div>
      <div class="input-row">
        <Input
          bind:value={tagInput}
          id="tags"
          placeholder={m.ask_tags_placeholder()}
          disabled={tags.length >= 6 || loading}
          onkeydown={e => {
            if (e.key === 'Enter')
              addTag()

            if (e.key === 'Backspace' && tagInput.length === 0)
              if (e.shiftKey) remTag(tags[0])()
              else remTag(tags[tags.length - 1])()
          }}
        />
        <Button onclick={addTag} disabled={tags.length >= 6 || loading}>
          <Plus />
        </Button>
      </div>
    </Panel>
  </Label>

  <Separator variant="secondary" />

  <div class="actions">
    <Button class="big" scaling={false} onclick={onSubmit} disabled={loading}>
      {m.ask_submit()}
    </Button>
    <Button class="small" variant="secondary" scaling={false} disabled={loading}>
      <Archive />
      <span class="title">
        {m.ask_draft()}
      </span>
    </Button>
  </div>
</Panel>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  :global
  .titchy.panel.form {
    flex: 1;

    > h2 {
      @include flexbox(false, row, center, $gap: 15px);
      margin-bottom: 15px;

      svg { @include size(1.2em); color: C(accent); }
    }

    > .titchy.label {
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
        font-family: FiraCode;
      }

      &.tags-label {
        &.disabled { opacity: 0.5; }

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

    > .actions {
      flex-direction: row;
      gap: 0.75em;

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
            white-space: nowrap;
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
</style>
