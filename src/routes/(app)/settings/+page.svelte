<script lang="ts">
  import { api } from "$/client/api";
  import { LocalStorage } from "$/client/storage";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { m } from "@/paraglide/messages";
  import { Moon, Palette, Sun } from "@lucide/svelte";
  import { Button, Option, Panel, Select } from "titchy";

  const { data } = $props();

  const signOut = async () => {
    await api({ method:'POST', path:'/auth/sign-out' });
    await goto("/");
  };
</script>

<Panel class="settings">
  <Panel variant="secondary">
    <div class="label">
      <Palette />
      <span>{m.theme_theme()}</span>
    </div>
    <Select label={m.theme_theme()} value={browser ? LocalStorage.get('theme') : ''}>
      <Option value="dark" onclick={() => LocalStorage.set('theme', 'dark')}>
        <Moon />
        {m.theme_dark()}
      </Option>
      <Option value="light" onclick={() => LocalStorage.set('theme', 'light')}>
        <Sun />
        {m.theme_light()}
      </Option>
    </Select>
  </Panel>
  {#if data.auth.isSigned}
    <Button onclick={signOut} scaling={false}>
      {m.auth_sign_out()}
    </Button>
  {/if}
</Panel>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  :global
  .titchy.panel.settings {
    flex: 1;

    .titchy.panel {
      .label {
        flex-direction: row;
        align-items: center;
        gap: 0.5ch;

        font-weight: bold;
        span { color: C(accent); }
      }

      .titchy.select {
        > .titchy.button {
          box-shadow: none;
        }

        .titchy.option {
          flex-direction: row;
          align-items: center;
          gap: 0.5ch;
        }
      }
    }
  }
</style>
