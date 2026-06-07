## Plan

### 1. Localize the Verify Certificate page (`src/pages/VerifyCertificate.tsx`)

Currently all copy is hardcoded English. Wire it to `react-i18next` like the rest of the site.

**New translation keys** (added to `en.json`, `tr.json`, `ru.json`, `ar.json`):

```
verifyCertificate: {
  pageTitle: "Verify Certificate on Base — UTAAB",
  backHome: "Back to home",
  badge: "Certificate Verification",
  heading: { prefix: "Verify on", network: "Base" },
  subtitle: "Confirm that a UTAAB certificate was officially issued and recorded on the {{network}} blockchain as a soulbound, non-transferable token.",
  form: { placeholder: "UTAAB-BB-2026-0001", submit: "Verify" },
  notConfigured: "On-chain registry not yet configured — verification uses the secure registry only.",
  errors: { network: "Could not reach {{network}}. Please try again later." },
  trust: {
    onChain:   { title: "On-chain on {{network}}", desc: "Every certificate is registered as a soulbound token." },
    tamper:    { title: "Tamper-proof",            desc: "Cryptographic serial hash, verifiable on public RPC." },
    public:    { title: "Public verification",     desc: "Anyone can verify — no account, no API key." }
  }
}
```

- Replace hardcoded strings in `VerifyCertificate.tsx` with `t(...)` calls, passing `{ network: NETWORK_LABEL }` for interpolation.
- Also localize fallback values returned from `runVerify` (e.g. `'Unknown event'`, `'Certificate of Participation'`, `'UTAAB'`) via `t()`.
- `document.title` uses the translated `pageTitle`.

**`VerificationResultCard`** (`src/components/verify/VerificationResultCard.tsx`) — also localize its labels/status copy in the same pass so the result panel matches the active language. (I'll inspect it during implementation and add corresponding `verifyCertificate.result.*` keys.)

Translations provided in all four locales (en/tr/ru/ar) for every new key.

### 2. Add the official UTAA university community note to the About section

Two surfaces:

**a) Homepage About blurb** (`src/components/AboutBlurb.tsx` + `about` namespace)
Add a small line below the existing `about.blurb` and render it as a new paragraph with an external link:

```
about.officialCommunity.text: "We host our official student community at the University of Turkish Aeronautical Association (UTAA) in Ankara, Türkiye."
about.officialCommunity.linkLabel: "Visit the official UTAA Blockchain Community page →"
about.officialCommunity.url:  "https://www.thk.edu.tr/tr/student-clubs/turk-hava-kurumu-universitesi-blockchain-toplulugu"
```

Render below the existing blurb paragraph as a centered text + link (`target="_blank" rel="noopener noreferrer"`), using existing tokens (`text-muted-foreground`, `text-accent hover:underline`).

**b) About page** (`src/pages/About.tsx` + `aboutPage` namespace)
Add a compact info card (or paragraph in the existing `whyUtaab` / `mission` area) titled "Official University Community" with the same text and link, so the information lives on both the homepage blurb and the full About page.

```
aboutPage.officialCommunity: {
  title: "Official University Community",
  body: "UTAAB hosts its official student community at the University of Turkish Aeronautical Association (UTAA), located in Ankara, Türkiye.",
  linkLabel: "View on thk.edu.tr",
  url:  "https://www.thk.edu.tr/tr/student-clubs/turk-hava-kurumu-universitesi-blockchain-toplulugu"
}
```

Translations added in en/tr/ru/ar (Turkish & Russian: appropriate native phrasing; Arabic: RTL-safe text).

### Files touched
- `src/pages/VerifyCertificate.tsx`
- `src/components/verify/VerificationResultCard.tsx`
- `src/components/AboutBlurb.tsx`
- `src/pages/About.tsx`
- `src/i18n/locales/{en,tr,ru,ar}.json`

No business logic, schema, or dependency changes.
