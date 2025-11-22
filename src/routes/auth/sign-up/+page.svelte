<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button, Input, InputWrapper, Label, Link, Loading, Separator } from "titchy";
  import { AtSign, CircleCheck, CircleX, Lock, Mail, UserRound } from "@lucide/svelte";

  import { m } from "@/paraglide/messages";
  import { SignUpForm } from "$/utils/zod/forms";
  import { api } from "$/client/api";

  let submitSuccess = $state(false);
  let loading       = $state(false);
  let username      = $state("");
  let email         = $state("");
  let password      = $state("");

  let usernameErrors = $state<string[]>([]);
  let emailErrors    = $state<string[]>([]);
  let passwordErrors = $state<string[]>([]);

  const validate = async () => {
    loading        = true;
    usernameErrors = [];
    emailErrors    = [];
    passwordErrors = [];

    const { success, error, data } = SignUpForm.safeParse({ username, email, password });


    if (success) {
      const res = await api({ method:'POST', path:'/auth/sign-up', args:data });

      if (res.data)
        submitSuccess = true;
      else
        passwordErrors = [m.auth_error_invalid_credentials()]
    }

    else {
      for (const issue of error.issues) {
        if (issue.path[0] === 'username')
          usernameErrors.push(
              issue.code === 'too_small'      ? m.auth_error_too_small({ minimum:issue.minimum })
            : issue.code === 'too_big'        ? m.auth_error_too_big({ maximum:issue.maximum })
            : issue.code === 'invalid_format' ? m.auth_error_invalid_format({ pattern:issue.pattern ?? "" })
            : ""
          )

        if (issue.path[0] === 'email')
          emailErrors.push(
              issue.code === 'invalid_format' ? m.auth_error_invalid_email()
            : ""
          )

        if (issue.path[0] === 'password')
          passwordErrors.push(
              issue.code === 'too_small' ? m.auth_error_too_small({ minimum:issue.minimum })
            : issue.code === 'too_big'   ? m.auth_error_too_big  ({ maximum:issue.maximum })
            : issue.code === 'invalid_format' ? m.auth_error_invalid_format({ pattern:issue.pattern ?? "" })
            : ""
          )
      }
    }
  };
</script>

<h1>{m.auth_create_account()}</h1>

{#if submitSuccess}
  <div class="success">
    <h2><CircleCheck /> {m.auth_sign_up_success()}</h2>
    <span>
      {m.auth_check_inbox()}
    </span>
    <small>
      {m.go_to()}
      <Link href="/">{m.home_page()}</Link>.
    </small>
  </div>
{:else}
  <Label for="username">
    <div class="label-content">
      <UserRound />
      <span>{m.auth_username()}</span>
    </div>
    <InputWrapper icon={AtSign}>
      <Input bind:value={username} id="new-username" type="text" name="username" placeholder={m.auth_username_placeholder()} />
    </InputWrapper>
    {#each usernameErrors as error}
      <div class="error">
        <CircleX />
        <span>{error}</span>
      </div>
    {/each}
  </Label>

  <Label for="email">
    <div class="label-content">
      <Mail />
      <span>{m.auth_email()}</span>
    </div>
    <InputWrapper>
      <Input bind:value={email} id="email" type="email" name="email" placeholder={m.auth_email_placeholder()} />
    </InputWrapper>
    {#each emailErrors as error}
      <div class="error">
        <CircleX />
        <span>{error}</span>
      </div>
    {/each}
  </Label>

  <Label for="new-password">
    <div class="label-content">
      <Lock />
      <span>{m.auth_password()}</span>
    </div>
    <InputWrapper side-actions={{ hidable:'always' }}>
      <Input bind:value={password} id="new-password" type="password" name="new-password" placeholder={m.auth_password_placeholder()} />
    </InputWrapper>
    {#each passwordErrors as error}
      <div class="error">
        <CircleX />
        <span>{error}</span>
      </div>
    {/each}
  </Label>

  <Separator variant="secondary" thickness="s" />

  <Label>
    <Button class="submit" onclick={validate} disabled={loading}>
      <span>{m.auth_sign_up()}</span>
      {#if loading}
        <Loading />
      {/if}
    </Button>
  </Label>

  <div class="link">
    <span>
      <small>
        {m.auth_got_an_account()}
        <Link href="/auth/sign-in">{m.auth_sign_in()}</Link>
      </small>
    </span>
  </div>
{/if}
