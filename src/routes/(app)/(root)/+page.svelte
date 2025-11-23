<script lang="ts">
  import { ButtonGroup, Button, Panel, Screen, Link } from "titchy";

  import { m } from "@/paraglide/messages";
  import { Footer } from "$/components";
</script>

<Screen>
  <div class="hello">
    <Panel class="hi" centered>
      <span>
        {m.welcome({ name:m.fussr() })}
      </span>
      <ButtonGroup class="group">
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
      </ButtonGroup>
    </Panel>
  </div>
</Screen>

<Footer />

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

      .titchy.button-group.group {
        direction: ltr;
      }
    }
  }
</style>
