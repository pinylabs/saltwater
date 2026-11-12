# Saltwater

Sydney's coastal walks, walked, timed and written up, with where to swim at the end. The Pinies made it in [Piny](https://piny.studio/home/) from the accepted design: an EmDash site led by its photographs.

- **Home:** the coast clip behind the headline, with the first walk's route drawn along its lower edge; the five walks as a mosaic of cards; the field log and its counts; the safety band; and a quote over a photograph.
- **Walks:** every walk in one list, with its photograph, its facts and whether it has been walked yet.
- **A walk:** its photograph growing into place from the card, its numbers, a plain note while nobody has walked it, a photo story whose photographs stay pinned while their panels scroll past, the write-up, and the route with each stop.
- **About, Tides & safety and the map:** plain pages from EmDash's pages collection.
- **A feed** of every walk at `/rss.xml`, and a 404 that points back to the walks.

The walks, their stops and photo stories, the field log, the counts, the safety notes, the plain pages and the home's words are EmDash content, seeded from `seed/seed.json` and edited in the admin. A walk says plainly that it is still coming until a person has walked it and dated the check.

## Start it

- **In Piny:** pick it in the Templates tab.
- **Outside Piny:** `npm create astro -- --template github:pinylabs/saltwater`, then `pnpm install` and `pnpm dev`, and open `/_emdash/admin` to set up the site.

It needs Node 22 or later and pnpm.

## On Cloudflare

It runs as a Cloudflare Worker (`src/worker.ts`, with `nodejs_compat`), and `wrangler.jsonc` gives it:

- a D1 database, bound as `DB`, for EmDash's content;
- an R2 bucket, bound as `MEDIA`, for media uploaded in the admin;
- a cron trigger every minute, for EmDash's maintenance.

Sandboxed plugins need a Worker Loader (`LOADER`), which is on Workers paid plans; its line in `wrangler.jsonc` is there to uncomment. The Astro Cloudflare adapter also asks for its own `SESSION` KV namespace and `IMAGES` binding. `pnpm run deploy` builds the site and deploys it with Wrangler.

## Its look

The pages are styled with Tailwind CSS 4. Every colour, face, size, radius, shadow and measure is a token in `src/styles/theme.css`, so the look changes there:

- `primary` is the sea, `secondary` the sun yellow, `tertiary` the sand and `neutral` the ink, each a scale from 50 to 950 with the design's own colours on its steps;
- `--font-display`, `--font-serif` and `--font-sans` are Bricolage Grotesque (condensed, for headings), Newsreader (for text) and Instrument Sans (for labels), loaded from Google Fonts in `src/layouts/Site.astro`;
- the type scale, the radii, the fixed heights and the page's measures have names, for example `text-hero`, `rounded-card` and `max-w-page`.

`src/styles/global.css` holds what utilities cannot say: the headings' defaults, the shades over the photographs, the photo story's pinned photographs, a page's text as EmDash renders it, and the motion. Light and dark follow the visitor's system, and all motion stops under `prefers-reduced-motion`.

## Photos and video

They are linked from their sources and never copied into this repository. A walk's card photograph is also its page's hero.

- Home: the Bondi to Coogee card; its walk page: the hero: [Dominic Kurniawan Suryaputra](https://unsplash.com/@d_ks11) on Unsplash, [Unsplash License](https://unsplash.com/license), linked from [its page](https://unsplash.com/photos/a-person-standing-on-a-cliff-overlooking-the-ocean-TfME1TgD-hQ), not copied.
- Home: the Spit to Manly card; its walk page: the hero: [Gary Runn](https://unsplash.com/@garunn) on Unsplash, [Unsplash License](https://unsplash.com/license), linked from [its page](https://unsplash.com/photos/sea-cliff-during-daytime-GKrux4c4Sbc), not copied.
- Home: the South Head card; its walk page: the hero: [Steven Zhang](https://unsplash.com/@notevensteven) on Unsplash, [Unsplash License](https://unsplash.com/license), linked from [its page](https://unsplash.com/photos/a-red-and-white-lighthouse-sitting-on-top-of-a-cliff-next-to-the-ocean-vDBVSOp38yE), not copied.
- Home: the Coast Track card; its walk page: the hero: [Matt Str](https://unsplash.com/@matt039_yt) on Unsplash, [Unsplash License](https://unsplash.com/license), linked from [its page](https://unsplash.com/photos/white-cliffs-towering-over-a-deep-blue-ocean-hf23qR1E3dw), not copied.
- Home: the Bondi to Watsons Bay card; its walk page: the hero: [Jack Bass](https://unsplash.com/@j_bzl) on Unsplash, [Unsplash License](https://unsplash.com/license), linked from [its page](https://unsplash.com/photos/blue-body-of-water-near-cliff-YPZPUwJIwak), not copied.
- Bondi to Coogee's photo story, first stop: [Colton Jones](https://unsplash.com/@colt10jordan) on Unsplash, [Unsplash License](https://unsplash.com/license), linked from [its page](https://unsplash.com/photos/person-with-surf-board-walking-beside-seashore-Uy-sl6JCy6g), not copied.
- Bondi to Coogee's photo story, second stop; home: the quote: [Kelvin Li](https://unsplash.com/@kelollapalooza) on Unsplash, [Unsplash License](https://unsplash.com/license), linked from [its page](https://unsplash.com/photos/blue-and-brown-swimming-pool-beside-blue-and-white-ocean-water-during-daytime-eBQ7Uzux3qk), not copied.
- Bondi to Coogee's photo story, last stop: [Dominic Kurniawan Suryaputra](https://unsplash.com/@d_ks11) on Unsplash, [Unsplash License](https://unsplash.com/license), linked from [its page](https://unsplash.com/photos/a-view-of-a-beach-with-a-city-in-the-background-styDbdRnb1U), not copied.
- Home: the clip looped behind the headline, and its still frame: [Edan Kwon](https://www.pexels.com/video/a-pool-with-waves-crashing-on-the-shore-20512871/) on Pexels, [Pexels License](https://www.pexels.com/license/), linked from [its page](https://www.pexels.com/video/a-pool-with-waves-crashing-on-the-shore-20512871/), not copied.

## Licence

MIT. Built on EmDash's `blog-cloudflare` template, MIT, Copyright 2026 Cloudflare Inc.; its notice is kept in [LICENSE](LICENSE). Made by the Pinies in [Piny](https://piny.studio/home/). The Piny Studio mark in `public/brand` is Piny's and is not covered by this template's MIT licence.
