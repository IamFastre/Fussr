<script lang="ts">
  import { Panel } from "titchy";
  import { AtSign, Earth, Clock } from "@lucide/svelte";

  import { m } from "@/paraglide/messages";
  import { getLocale } from "@/paraglide/runtime";
  import { COUNTRIES } from "$/utils";
  import type { UserPublic } from "$/utils/types";
  import { query } from "$/client/api";
  import { NotFound } from "$/components";
  import { page } from "$app/state";

  interface Props {
    user: UserPublic | null;
  }

  const { user:userInit }: Props = $props();


  const userQuery = query({ method:'GET', path:'/users/[username]', params:{ username:userInit?.username! } }, userInit!);
  const locale    = getLocale();

  const user = $derived(userQuery.data ?? userInit);
</script>

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
    <!-- Activity content goes here -->
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
  }
</style>
