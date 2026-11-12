/**
 * The walks as a feed. Every walk is listed, including the ones still coming,
 * because the note that says so is part of the walk's page.
 */
import type { APIRoute } from "astro";
import { getSiteName, getWalks } from "../lib/content";

const escape = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");

export const GET: APIRoute = async ({ url }) => {
	const [walks, siteName] = await Promise.all([getWalks(), getSiteName()]);
	const origin = url.origin;

	const items = walks
		.map((walk) => {
			const link = `${origin}/walks/${walk.slug}`;
			const description =
				walk.summary ||
				walk.comingNote ||
				`${walk.title}, on Sydney's coast.`;
			return [
				"<item>",
				`<title>${escape(walk.title)}</title>`,
				`<link>${escape(link)}</link>`,
				`<guid>${escape(link)}</guid>`,
				`<description>${escape(description)}</description>`,
				"</item>",
			].join("");
		})
		.join("");

	const feed = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<rss version="2.0">',
		"<channel>",
		`<title>${escape(siteName)}</title>`,
		`<link>${escape(origin)}</link>`,
		`<description>${escape("Sydney's coastal walks, walked, timed and written up.")}</description>`,
		"<language>en-au</language>",
		items,
		"</channel>",
		"</rss>",
	].join("");

	return new Response(feed, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
