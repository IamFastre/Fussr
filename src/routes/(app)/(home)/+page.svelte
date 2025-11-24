<script lang="ts">
  import { ButtonGroup, Button, Panel, Link } from "titchy";

  import { m } from "@/paraglide/messages";
  import { api } from "$/client/api";

  const { data } = $props();

  const onSignOut = async () => {
    await api({ method:'POST', path:'/auth/sign-out' });
    location.reload();
  };
</script>

<div class="hello">
  <Panel class="hi" centered>
    <span>
      {m.welcome({ name:m.fussr() })}
    </span>
    <div class="buttons">
      <ButtonGroup class="group">
        {#if data.auth.isSigned}
          <Link variant="wrapper" href="/me">
            <Button>
              {m.routes_me()}
            </Button>
          </Link>
          <Button onclick={onSignOut}>
            {m.auth_sign_out()}
          </Button>
        {:else}
          <Link variant="wrapper" href="/auth/sign-in">
            <Button>
              {m.auth_sign_in()}
            </Button>
          </Link>
          <Link variant="wrapper" href="/auth/sign-up">
            <Button>
              {m.auth_sign_up()}
            </Button>
          </Link>
        {/if}
      </ButtonGroup>
      {#if data.auth.isSigned}
        <Link variant="wrapper" href="/ask">
          <Button>
            Ask
          </Button>
        </Link>
      {/if}
    </div>
  </Panel>
</div>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  .hello {
    flex: 1;
    @include flex-center();

    span {
      text-align: center;
      font-size: 4rem;
      font-weight: 100;
    }

    :global
    .titchy.panel.hi {
      margin: 25px;
      padding: 50px;
      gap: 50px;

      .buttons {
        gap: 10px;

        .titchy.button-group.group {
          direction: ltr;
        }
      }
    }
  }
</style>
