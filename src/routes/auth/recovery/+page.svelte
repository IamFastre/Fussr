<script lang="ts">
  import { onMount } from "svelte";
  import { replaceState } from "$app/navigation";
  import { page } from "$app/state";
  import { Button, Input, InputWrapper, Label, Link, Loading, Separator } from "titchy";
  import { CircleCheck, CircleX, Mail } from "@lucide/svelte";

  import { m } from "@/paraglide/messages";
  import { RecoveryForm } from "$/utils/zod/forms";
  import { api } from "$/client/api";

  let submitSuccess = $state(false);
  let loading       = $state(false);
  let email         = $state("");

  let emailErrors = $state<string[]>([]);

  // Read email from search params and immediately remove it
  onMount(() => {
    email = page.url.searchParams.get("email") ?? "";
    page.url.searchParams.delete("email");

    if (email)
      replaceState(page.url, page.state);
  });

  const validate = async () => {
    loading     = true;
    emailErrors = [];

    const { success, error, data } = RecoveryForm.safeParse({ email });

    if (success) {
      const res = await api({ method:'POST', path:'/auth/recovery', args:data });

      if (res.data)
        submitSuccess = true;
      else
        emailErrors = [m.auth_error_invalid_credentials()]
    }

    else {
      for (const issue of error.issues) {
        if (issue.path[0] === 'email')
          emailErrors.push(
              issue.code === 'invalid_format' ? m.auth_error_invalid_email()
            : ""
          )
      }
    }

    loading = false;
  };
</script>

<h1>{m.auth_account_recovery()}</h1>

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

  <Separator variant="secondary" thickness="s" />

  <Label>
    <Button class="submit" onclick={validate} disabled={loading}>
      <span>{m.auth_send_recovery_mail()}</span>
      {#if loading}
        <Loading />
      {/if}
    </Button>
  </Label>

  <div class="link">
    <span>
      <small>
        {m.auth_suddenly_remembered()}
        <Link href="/auth/sign-in">{m.auth_sign_in()}</Link>
      </small>
    </span>
  </div>
{/if}
