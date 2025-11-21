<script lang="ts">
  import { CircleX, Lock, Mail } from "@lucide/svelte";
  import { Button, Input, InputWrapper, Label, Link, Separator } from "titchy";

  import { m } from "@/paraglide/messages";

  let email    = $state("");
  let password = $state("");

  let emailError    = $state("");
  let passwordError = $state("");
</script>

<h1>{m.auth_signing_in()}</h1>

<Label for="email">
  <div class="label-content">
    <Mail />
    <span>{m.auth_email()}</span>
  </div>
  <InputWrapper>
    <Input bind:value={email} id="email" type="email" placeholder={m.auth_email_placeholder()} />
  </InputWrapper>
  {#if emailError}
    <div class="error">
      <CircleX />
      <span>{emailError}</span>
    </div>
  {/if}
</Label>

<Label for="password">
  <div class="label-content">
    <Lock />
    <span>{m.auth_password()}</span>
    <div style:flex="1"></div>
    <small>
      <Link href="/auth/recovery?email={email}">{m.auth_forgot_password()}</Link>
    </small>
  </div>
  <InputWrapper side-actions={{ hidable:'always' }}>
    <Input bind:value={password} id="password" type="password" placeholder={m.auth_password_placeholder()} />
  </InputWrapper>
  {#if passwordError}
    <div class="error">
      <CircleX />
      <span>{passwordError}</span>
    </div>
  {/if}
</Label>

<Separator variant="secondary" thickness="s" />

<Label>
  <Button>
    {m.auth_sign_in()}
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
