<script lang="ts">
  import { AtSign, Clock, Earth } from "@lucide/svelte";
  import { Panel } from "titchy";

  const { data } = $props();

  // TODO: use tanstack query to fetch user data
  const user = data.user;
</script>

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
    <span class="bio">
      {user.bio}
    </span>
    <div class="props">
      <!-- TODO: ADD LOCATION -->
      <div class="prop since">
        <Earth />
        <span>Egypt</span> <!-- TODO: USE REAL LOCATION -->
      </div>
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
        font-family: Fira Code; // TODO: ADD FIRE CODE
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
      align-items: center;
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
      }
    }
  }

  :global
  .titchy.panel.activity-card {
    flex: 1;
  }
</style>
