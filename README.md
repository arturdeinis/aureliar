# 371AURELIAR

Website for 371AURELIAR, a private members' society in Riga.
Static HTML, CSS and vanilla JS. No build step.

```
index.html                 Home
apply.html                 Membership application
assets/css/styles.css      One stylesheet
assets/js/main.js          Every interaction, the scroll loop, form + CRM hook
assets/js/vendor/lenis     Smooth wheel scrolling (MIT, vendored, optional)
assets/video/              Hero film, reel, 720p mobile cut
assets/img/                Stills pulled from the film, og image
favicon.svg
```

## Run it

```
python3 -m http.server 8371
```
then open http://localhost:8371

Deploys to any static host: GitHub Pages, Netlify, Vercel, Cloudflare Pages.

## Content

Copy follows aureliar.com: Society, the four chapters (Opening Night,
Padel & Dinner, Beach Club, The Return), Chapter V "Top 100" on 10 October,
the founders' statement, membership, and the six questions.

The Chapter V countdown reads its target from `data-countdown` on `.countdown`
in `index.html` (currently `2026-10-10T19:00:00+03:00`). Change the date there
when the next chapter is announced.

## Media

Everything visual comes from one 14.6 s 4K film of Chapter IV (The Return,
ShiYuzu). From it:

| File | Use |
|---|---|
| `video/hero.mp4`, `hero.webm` | Hero background, 1080p, no audio |
| `video/hero-720.mp4` | Hero on screens up to 900 px wide |
| `video/reel.mp4` | The scroll-expanding film, slowed to 0.6x |
| `img/hero-poster.jpg`, `reel-poster.jpg` | Posters |
| `img/club-*.jpg` | Chapter stills (4:5) |
| `img/moment-1..6.jpg` | The Return gallery |
| `img/ambassador.jpg` | Founders section |
| `img/apply.jpg` | Application page |
| `img/wide.jpg` | Membership background |
| `img/pill-1..3.jpg` | Inline pictures in the manifesto |
| `img/og.jpg` | Share card, 1200 x 630 |

Chapters I to III currently use stills from The Return, because the film is
the only footage we have. Swap in real photos from Opening Night, Padel &
Dinner and Beach Club when they exist: same filenames, 4:5.

The source `.mov` is git-ignored; re-encode from it with ffmpeg if needed.

## Design

Film-led and editorial. Each section is one scene with one layout idea and
one motion idea.

- Ink `#0E0E0F`, cream `#F2EFE9`, champagne `#C9A66B`. `--gold` on ink,
  `--gold-ink` on cream (AA).
- Newsreader (display) + Archivo (interface), from Google Fonts.
- Sections are introduced by an index label (`.label`: italic serif number and
  a tracked caption), numbered to match the menu.
- Pills for interactive elements, square for everything else. The manifesto's
  inline pictures are the one deliberate exception.
- Captions sit below pictures, never on top of them.

Scenes, in order: hero film with a curtain intro; manifesto whose words light
up with scroll; the archive, a sticky picture that wipes between chapters;
the reel, which expands from an inset to full bleed; The Return, a gallery
that travels sideways while you scroll; Chapter V with a live countdown; the
founders' letter; membership over a parallax still; questions; footer with a
live Riga clock and the wordmark rising into view.

Motion runs from one `requestAnimationFrame` loop in `main.js`. Everything
respects `prefers-reduced-motion`: no curtain, no smooth scroll, no parallax,
the film starts paused, the gallery becomes a swipe rail. The hero film has a
visible pause control, and every film pauses when off screen.

## Connecting the CRM

`assets/js/main.js` has one hook:

```js
var ENDPOINT = null;   // -> your CRM / Zapier / serverless endpoint
```

While it is `null` the form validates, shows the confirmation screen and logs
the payload, so the flow is demoable. Set it to a URL and this JSON is POSTed.
Field names match the live application form on aureliar.com:

```json
{
  "firstName": "", "lastName": "", "email": "", "phone": "", "country": "",
  "instagram": "", "building": "", "contribution": "", "characterAnswer": "",
  "consent": true, "source": "aureliar.com/apply", "submittedAt": "ISO-8601"
}
```
