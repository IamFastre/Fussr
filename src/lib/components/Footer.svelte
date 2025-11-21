<script>
  import { Button, Link } from "titchy";

  import { m } from "@/paraglide/messages";
  import { getLocale, setLocale } from "@/paraglide/runtime";

  const locale = getLocale();
</script>
<footer class="footer">
  <div class="creds">
    <span>{m.footer_rights_reserved()} © 2025</span>
    <span>{m.footer_by()} <Link href="https://neria.studio" external>{m.footer_neria_studio()}</Link></span>
  </div>
  <div class="locales">
    <Button variant="wrapper" scaling={false} onclick={() => setLocale('en')} disabled={locale === 'en'}>
      <Link>
        English
      </Link>
    </Button>
    <Button variant="wrapper" scaling={false} onclick={() => setLocale('ar')} disabled={locale === 'ar'}>
      <Link>
        العربية
      </Link>
    </Button>
  </div>
</footer>

<style lang="scss">
  @use "@/styles/utils.scss" as *;

  .footer {
    @include flex-center();
    gap: 15px;
    padding: 15px;
    min-height: max(150px, 10dvh);
    background-color: C(secondary, 2%);

    .creds {
      align-items: center;
    }

    .locales {
      flex-direction: row;
      align-items: center;
      gap: 1.5ch;
      font-size: 0.85em;
    }
  }
</style>
