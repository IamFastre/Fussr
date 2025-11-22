<script lang="ts">
  import { AtSign, CircleX, Lock, Mail, UserRound } from "@lucide/svelte";
  import { Button, Input, InputWrapper, Label, Link, Separator } from "titchy";

  import { m } from "@/paraglide/messages";
  import { AuthForm } from "$/utils/zod/forms";

  let username = $state("");
  let email    = $state("");
  let password = $state("");

  let usernameErrors = $state<string[]>([]);
  let emailErrors    = $state<string[]>([]);
  let passwordErrors = $state<string[]>([]);

  const validate = () => {
    usernameErrors = [];
    emailErrors    = [];
    passwordErrors = [];

    const { success, error } = AuthForm.safeParse({ username, email, password });

    if (!success) {
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
  <Button onclick={validate}>
    {m.auth_sign_up()}
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
