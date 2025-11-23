<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button, Input, InputWrapper, Label, Link, Loading, Separator } from "titchy";
  import { CircleX, Lock, Mail } from "@lucide/svelte";

  import { m } from "@/paraglide/messages";
  import { SignInForm } from "$/utils/zod/forms";
  import { api } from "$/client/api";

  let loading  = $state(false);
  let email    = $state("");
  let password = $state("");

  let emailErrors    = $state<string[]>([]);
  let passwordErrors = $state<string[]>([]);

  const validate = async () => {
    loading        = true;
    emailErrors    = [];
    passwordErrors = [];

    const { success, error, data } = SignInForm.safeParse({ email, password });

    if (success) {
      const res = await api({ method:'POST', path:'/auth/sign-in', args:data });

      if (res.data)
        await goto("/me", { invalidateAll:true });
      else
        passwordErrors = [m.auth_error_invalid_credentials()]
    }

    else {
      for (const issue of error.issues) {
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

    loading = false;
  };
</script>

<h1>{m.auth_signing_in()}</h1>

<Label for="email">
  <div class="label-content">
    <Mail />
    <span>{m.auth_email()}</span>
  </div>
  <InputWrapper>
    <Input bind:value={email} id="email" type="email" name="email" disabled={loading} placeholder={m.auth_email_placeholder()} />
  </InputWrapper>
  {#each emailErrors as error}
    <div class="error">
      <CircleX />
      <span>{error}</span>
    </div>
  {/each}
</Label>

<Label for="password">
  <div class="label-content">
    <Lock />
    <span>{m.auth_password()}</span>
    <div style:flex="1"></div>
    <small>
      <Link href="/auth/recovery{email ? `?email=${email}` : ""}">{m.auth_forgot_password()}</Link>
    </small>
  </div>
  <InputWrapper side-actions={{ hidable:'always' }}>
    <Input bind:value={password} id="password" type="password" name="password" disabled={loading} placeholder={m.auth_password_placeholder()} />
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
    <span>{m.auth_sign_in()}</span>
    {#if loading}
      <Loading />
    {/if}
  </Button>
</Label>

<div class="link">
  <span>
    <small>
      {m.auth_got_no_account()}
      <Link href="/auth/sign-up">{m.auth_sign_up()}</Link>
    </small>
  </span>
</div>
