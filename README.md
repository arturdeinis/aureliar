# 371AURELIAR

Website for 371AURELIAR, a private members club in Riga.
Static HTML, CSS and vanilla JS. No build step, no dependencies.

```
index.html          Home
apply.html          Membership application
assets/css/         One stylesheet
assets/js/main.js   Header, menu, reveals, moments rail, FAQ, form + CRM hook
assets/video/       Film slots (see the README in there)
assets/img/         Photography slots, posters, og image
favicon.svg
```

## Run it

```
python3 -m http.server 8080
```
then open http://localhost:8080

Deploys to any static host: Netlify, Vercel, Cloudflare Pages, S3.

## Design

Editorial and photography-led, built against the reference clubs (CORE, Soho
House, Tuxedo Society, 39 Monte Carlo) without copying their templating.

- Ink `#0E0E0F`, cream `#F2EFE9`, champagne `#C9A66B`.
- Newsreader (display) + Archivo (interface), from Google Fonts. The display
  face is set light with the optical-size axis on, so headlines stay fine and
  small type stays legible on ink.
- Every colour, gutter and rhythm value is a CSS variable at the top of
  `styles.css`.

Rules the page is built to, worth keeping if you extend it:

- **Two theme blocks, not stripes.** Sections that share a surface are grouped
  and joined with `.band--joined`. The page flips ink/cream four times total,
  never section by section.
- **One accent.** `--gold` reads on ink, `--gold-ink` is the darker value that
  clears WCAG AA on cream. Never use `--gold` on a cream band.
- **Shape system.** Interactive elements are full pills, everything else is
  square. Inputs are a hairline underline only.
- **Eyebrows are rationed.** Three on the whole home page (hero, The Club,
  Membership). Section headlines carry the rest. Do not add a fourth.
- **Every section has its own layout family.** Full-bleed hero, centred
  manifesto, asymmetric bento, quote-over-film, offset split, horizontal rail,
  event ledger, numbered ledger, accordion. No two repeat.
- **The logo is the wordmark.** `371AURELIAR` in the display face, tracked
  wide, with a hairline beneath it, as on aureliar.com. `.mark` is the inline
  lockup for the bar, `.mark--lg` the centred one. There is no picture mark.
- **Captions live below pictures**, never on top of them (`.frame-cap`).
- **Contrast is verified, not assumed.** Both pages currently have zero text
  below WCAG AA. If you add a muted colour, check it.

Motion is restrained and `prefers-reduced-motion` is fully respected. There are
no scroll listeners: the header uses an IntersectionObserver sentinel and the
reveals use an IntersectionObserver.

## Media slots

Everything visual is a `.frame`. Each one already carries its ratio and a film
grade, so the page composes correctly before any assets exist. Each slot is
marked with an HTML comment naming the file and orientation it expects. Drop an
`<img>` or `<video>` inside the frame and it takes over.

See `assets/video/README.md` and `assets/img/README.md` for the full list.

Still outstanding from the client: the four film files, and `assets/img/og.jpg`
for link previews.

## Connecting the CRM

`assets/js/main.js` has one hook:

```js
var ENDPOINT = null;   // -> your CRM / Zapier / serverless endpoint
```

While it is `null` the form validates, shows the confirmation screen and logs
the payload, so the flow is demoable. Set it to a URL and this JSON is POSTed:

```json
{
  "firstName": "", "lastName": "", "email": "", "phone": "", "city": "",
  "birthYear": "", "company": "", "role": "", "field": "", "instagram": "",
  "referral": "", "motivation": "", "contribution": "",
  "consent": true, "source": "aureliar.com/apply", "submittedAt": "ISO-8601"
}
```

Field names and order are unchanged from the first build, so anything already
mapped downstream keeps working.

If the CRM needs a plain form POST instead, set `action`/`method` on
`#apply-form` and delete the `fetch` block.
