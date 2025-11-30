<script lang="ts">
  import { redirect } from "@sveltejs/kit";
  import { Button, Input, InputWrapper, Label, Option, Panel, Select, Separator, Textarea, useToaster } from "titchy";
  import { Pencil } from "@lucide/svelte";

  import { getLocale } from "@/paraglide/runtime";
  import { m } from "@/paraglide/messages";
  import { blobToDataURL, COUNTRIES, entries } from "$/utils";
  import { ProfileEditForm } from "$/utils/zod/forms";
  import { api } from "$/client/api";

  const { data } = $props();
  const user = $derived(data.user!);

  if (!data.user)
    redirect(303, '/auth');

  const toaster = useToaster();
  const locale = getLocale();

  let loading     = $state(false);
  let avatarFiles = $state<FileList>();

  let avatarBlob = $derived<Blob | undefined>(avatarFiles?.[0]);
  let display    = $state(data.user.display_name ?? "");
  let bio        = $state(data.user.bio ?? "");
  let country    = $state((data.user.country ?? "") as keyof typeof COUNTRIES);

  const onResetAvatar = async () => {
    loading = true;

    const res = await api({ method:'POST', path:'/users/reset-avatar' });

    if (res.error)
      toaster.add({ type: 'error', content: m.generic_error_occurred() });
    else
      location.reload();

    loading = false;
  };

  const onSubmit = async () => {
    loading = true;
    const avatar = avatarBlob ? await blobToDataURL(avatarBlob) : null;

    const args: ProfileEditForm = {
      avatar,
      display_name: display,
      bio,
      country,
    };

    const { success, data } = ProfileEditForm.safeParse(args);

    if (success) {
      const res = await api({ method:'POST', path:'/users/edit', args:data });

      if (res.error)
        toaster.add({ type: 'error', content: m.generic_error_occurred() });
      else
        location.reload();

      loading = false;
    }
  };
</script>

<Panel class="profile-edit">
  <div class="form">
    <Label class="avatar" for="avatar">
      <Panel class="img-container" variant="secondary">
        <img
          src={avatarBlob ? URL.createObjectURL(avatarBlob) : user.avatar}
          alt="{user.username}'s avatar"
        />
        <div class="icon">
          <Pencil />
        </div>
        <input
          bind:files={avatarFiles}
          type="file"
          id="avatar"
          accept="image/png,image/jpeg"
          disabled={loading}
        />
      </Panel>
      <div class="avatar-actions">
        <Button variant="blank" onclick={onResetAvatar}  disabled={loading}>
          {m.generic_reset()}
        </Button>
        {#if avatarBlob}
          <Button variant="blank" onclick={e => { e.preventDefault(); avatarBlob = undefined }} disabled={loading}>
            {m.generic_deselect()}
          </Button>
        {/if}
      </div>
    </Label>

    <Label class="displayName" for="displayName">
      <InputWrapper label={m.profile_display_name()}>
        <Input bind:value={display} placeholder={m.profile_display_name_placeholder()} disabled={loading} />
      </InputWrapper>
    </Label>

    <Label class="bio" for="bio">
      <InputWrapper label={m.profile_bio()}>
        <Textarea bind:value={bio} placeholder={m.profile_bio_placeholder()} disabled={loading} />
      </InputWrapper>
    </Label>

    <Panel class="field" variant="secondary">
      <Label class="country" for="country">
        <span class="title">{m.profile_country()}</span>
        <Select bind:value={country} label="---" texts={{ deselect:m.generic_deselect(), details:"" }} deselectable={!loading} copy-html>
          {#each entries(COUNTRIES) as [code, country], i (i)}
            <Option class="country-option" value={code} disabled={loading}>
              <img
                src="https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/{code}.svg"
                alt={country.emoji}
              />
              <span>{country.name[locale]}</span>
            </Option>
          {/each}
        </Select>
      </Label>
    </Panel>
    <Separator variant="secondary" line="dashed" />
    <Button scaling={false} onclick={onSubmit} disabled={loading}>
      {m.generic_save_changes()}
    </Button>
  </div>
</Panel>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  :global
  .titchy.panel.profile-edit {
    flex: 1;

    .titchy.label .title {
      color: C(accent);
      font-weight: bold;
    }

    .titchy.panel.field {
      padding: 10px;

      .titchy.button {
        box-shadow: none;
      }
    }
  }

  .form {
    flex: 1;
    gap: 10px;

    :global
    .titchy.label {
      .titchy.select {
        .titchy.option.country-option, .titchy.button .content {
          @include flexbox();
          flex-direction: row;
          align-items: center;
          gap: 0.5ch;

          img {
            @include size(2em);
          }
        }
      }
    }

    :global
    .titchy.label.avatar {
      @include flex-center;
      align-self: center;

      .titchy.panel.img-container {
        padding: 5px;
        @include flex-center;
        cursor: pointer;

        input[type="file"] { display: none; }

        img {
          border-radius: 5px;
          @include size(150px);
        }

        .icon {
          position: absolute;

          backdrop-filter: blur(5px);
          background-color: C(primary, 75%);
          padding: 10px;
          border-radius: 50%;

          svg {
            @include size(2em);
          }
        }
      }

      .avatar-actions {
        flex-direction: row;
        align-items: center;
        gap: 10px;
      }
    }
  }
</style>
