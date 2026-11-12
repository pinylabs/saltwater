import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";

export default defineConfig({
	output: "server",
	adapter: cloudflare(),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: d1({ binding: "DB", session: "auto", coalesce: true }),
			storage: r2({ binding: "MEDIA" }),
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
	// The site's three faces — Bricolage Grotesque, Newsreader and Instrument
	// Sans — come from the stylesheet link in src/layouts/Site.astro, because
	// the headings need Bricolage's condensed width axis (font-stretch 75%),
	// which the variable-font pipeline here does not ask Google for.
	devToolbar: { enabled: false },
});
