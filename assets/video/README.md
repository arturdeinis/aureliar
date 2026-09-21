# Film slots

| Slot | Where | File | Crop |
|---|---|---|---|
| Hero | Top of the homepage, full screen | `hero.mp4` + `hero.webm` | 16:9, must survive a 9:16 crop on phones |
| Reel | Full-bleed band under The Club | `reel.mp4` | 16:9, wide frames |
| Ambassadors | Left plate of the ambassadors section | can be a still instead | 4:5 |
| Apply | Left column of `apply.html` | `apply.mp4` | vertical, very low motion |

Each slot is a `.frame` with a commented-out `<video>` inside. Uncomment it and
delete the `<span class="frame__note">` beside it.

Specs: H.264 MP4 (plus VP9 WebM if you have it), no audio track, 1080p is
plenty, under about 6 MB each so the hero still opens instantly. Posters go in
`assets/img/` as `hero-poster.jpg`, `reel-poster.jpg`, `apply-poster.jpg`.
