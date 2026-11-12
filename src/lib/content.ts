/**
 * The site's content, read from EmDash.
 *
 * Everything a reader sees comes from seed/seed.json: the walks, the photo
 * story stops, the field log, the safety notes, the counters, the home page's
 * words and the plain pages. Nothing here writes; it only reads and tidies.
 */

import { getEmDashCollection, getEmDashEntry, getSiteSettings } from "emdash";

type Entry = {
	id: string;
	slug: string | null;
	data: Record<string, unknown>;
};

const text = (value: unknown): string =>
	typeof value === "string" ? value.trim() : "";

const count = (value: unknown): number => {
	const number = typeof value === "number" ? value : Number(value);
	return Number.isFinite(number) ? number : 0;
};

const ordered = (entries: Entry[]): Entry[] =>
	[...entries].sort(
		(left, right) => count(left.data.order) - count(right.data.order),
	);

async function all(collection: string): Promise<Entry[]> {
	try {
		// Published entries only; that is the reader's view of every collection.
		const { entries } = await getEmDashCollection(collection);
		return (entries ?? []) as unknown as Entry[];
	} catch {
		return [];
	}
}

async function one(collection: string, slug: string): Promise<Entry | null> {
	try {
		const { entry } = await getEmDashEntry(collection, slug);
		return (entry ?? null) as unknown as Entry | null;
	} catch {
		return null;
	}
}

/* ------------------------------------------------------------------ types */

export interface Walk {
	slug: string;
	title: string;
	region: string;
	grade: string;
	gradeNote: string;
	distance: string;
	duration: string;
	transport: string;
	summary: string;
	photo: string;
	photoAlt: string;
	photoCredit: string;
	photoCreditUrl: string;
	heroPhoto: string;
	cardSize: "big" | "small" | "wide";
	status: string;
	comingNote: string;
	lastChecked: string | null;
	start: string;
	finish: string;
	body: unknown[];
}

export interface StoryStop {
	title: string;
	text: string;
	photo: string;
	photoAlt: string;
	photoCredit: string;
	photoCreditUrl: string;
}

export interface LogEntry {
	when: string;
	text: string;
}

export interface SafetyNote {
	title: string;
	text: string;
}

export interface Counter {
	value: string;
	label: string;
}

export interface Credit {
	name: string;
	url: string;
}

export interface HomeContent {
	heroLine1: string;
	heroLine2: string;
	heroHighlight: string;
	heroIntro: string;
	ctaLabel: string;
	ctaHref: string;
	cta2Label: string;
	cta2Href: string;
	clipUrl: string;
	clipPoster: string;
	clipAlt: string;
	clipCredit: string;
	clipCreditUrl: string;
	walksEyebrow: string;
	walksHeading1: string;
	walksHeading2: string;
	walksNote: string;
	logHeading: string;
	quote: string;
	quoteAttribution: string;
	quotePhoto: string;
	quotePhotoAlt: string;
	quoteCredit: string;
	quoteCreditUrl: string;
	bandHeading1: string;
	bandHeading2: string;
	footerMade: string;
	footerLine: string;
}

export interface PageContent {
	title: string;
	intro: string;
	body: unknown[];
}

/* ------------------------------------------------------------- formatting */

const DATE_FORMAT = new Intl.DateTimeFormat("en-AU", {
	day: "numeric",
	month: "long",
	year: "numeric",
	timeZone: "Australia/Sydney",
});

/** The date a person last checked a walk, or null when no one has. */
export function formatChecked(value: unknown): string | null {
	if (value === null || value === undefined || value === "") return null;
	const date = value instanceof Date ? value : new Date(String(value));
	if (Number.isNaN(date.getTime())) return null;
	return DATE_FORMAT.format(date);
}

/* ------------------------------------------------------------------ walks */

function toWalk(entry: Entry): Walk {
	const data = entry.data;
	const grade = text(data.grade);
	const gradeNote = text(data.grade_note);
	const size = text(data.card_size);
	return {
		slug: entry.slug ?? text(data.slug),
		title: text(data.title),
		region: text(data.region),
		grade: gradeNote ? `${grade} · ${gradeNote}` : grade,
		gradeNote,
		distance: text(data.distance),
		duration: text(data.duration),
		transport: text(data.transport),
		summary: text(data.summary),
		photo: text(data.photo),
		photoAlt: text(data.photo_alt),
		photoCredit: text(data.photo_credit),
		photoCreditUrl: text(data.photo_credit_url),
		heroPhoto: text(data.hero_photo) || text(data.photo),
		cardSize: size === "big" || size === "wide" ? size : "small",
		status: text(data.walk_status) || "coming",
		comingNote: text(data.coming_note),
		lastChecked: formatChecked(data.last_checked),
		start: text(data.start),
		finish: text(data.finish),
		body: Array.isArray(data.body) ? data.body : [],
	};
}

/** Every walk, in the order the mosaic puts them. */
export async function getWalks(): Promise<Walk[]> {
	return ordered(await all("walks"))
		.map(toWalk)
		.filter((walk) => walk.slug && walk.title);
}

/** One walk, with the places it passes and the photographs it scrolls through. */
export async function getWalk(slug: string): Promise<{
	walk: Walk;
	stops: string[];
	story: StoryStop[];
} | null> {
	const [entries, stops, story] = await Promise.all([
		all("walks"),
		all("walk_stops"),
		all("story_stops"),
	]);

	const found = entries.find((entry) => entry.slug === slug);
	if (!found) return null;

	return {
		walk: toWalk(found),
		stops: ordered(stops.filter((stop) => text(stop.data.walk) === slug)).map(
			(stop) => text(stop.data.title),
		),
		story: ordered(
			story.filter((stop) => text(stop.data.walk) === slug),
		).map((stop) => ({
			title: text(stop.data.title),
			text: text(stop.data.text),
			photo: text(stop.data.photo),
			photoAlt: text(stop.data.photo_alt),
			photoCredit: text(stop.data.photo_credit),
			photoCreditUrl: text(stop.data.photo_credit_url),
		})),
	};
}

/* ------------------------------------------------------- home page pieces */

export async function getHome(): Promise<HomeContent | null> {
	const [entry] = ordered(await all("home"));
	if (!entry) return null;
	const data = entry.data;
	return {
		heroLine1: text(data.hero_line_1),
		heroLine2: text(data.hero_line_2),
		heroHighlight: text(data.hero_highlight),
		heroIntro: text(data.hero_intro),
		ctaLabel: text(data.hero_cta_label),
		ctaHref: text(data.hero_cta_href),
		cta2Label: text(data.hero_cta2_label),
		cta2Href: text(data.hero_cta2_href),
		clipUrl: text(data.clip_url),
		clipPoster: text(data.clip_poster),
		clipAlt: text(data.clip_alt),
		clipCredit: text(data.clip_credit),
		clipCreditUrl: text(data.clip_credit_url),
		walksEyebrow: text(data.walks_eyebrow),
		walksHeading1: text(data.walks_heading_1),
		walksHeading2: text(data.walks_heading_2),
		walksNote: text(data.walks_note),
		logHeading: text(data.log_heading),
		quote: text(data.quote),
		quoteAttribution: text(data.quote_attribution),
		quotePhoto: text(data.quote_photo),
		quotePhotoAlt: text(data.quote_photo_alt),
		quoteCredit: text(data.quote_credit),
		quoteCreditUrl: text(data.quote_credit_url),
		bandHeading1: text(data.band_heading_1),
		bandHeading2: text(data.band_heading_2),
		footerMade: text(data.footer_made),
		footerLine: text(data.footer_line),
	};
}

export async function getLogEntries(): Promise<LogEntry[]> {
	return ordered(await all("log_entries")).map((entry) => ({
		when: text(entry.data.when),
		text: text(entry.data.text),
	}));
}

export async function getSafetyNotes(): Promise<SafetyNote[]> {
	return ordered(await all("safety_notes")).map((entry) => ({
		title: text(entry.data.title),
		text: text(entry.data.text),
	}));
}

export async function getCounters(): Promise<Counter[]> {
	return ordered(await all("counters")).map((entry) => ({
		value: text(entry.data.value),
		label: text(entry.data.label),
	}));
}

/* ------------------------------------------------------------- plain pages */

export async function getPage(slug: string): Promise<PageContent | null> {
	const entry = await one("pages", slug);
	if (!entry) return null;
	return {
		title: text(entry.data.title),
		intro: text(entry.data.intro),
		body: Array.isArray(entry.data.body) ? entry.data.body : [],
	};
}

/* ---------------------------------------------------------------- credits */

/**
 * Every photographer and film-maker whose work the site links to, each named
 * with the page it came from. The footer lists them all; the photo itself
 * carries its credit wherever it appears.
 */
export async function getCredits(): Promise<Credit[]> {
	const [walks, home] = await Promise.all([getWalks(), getHome()]);

	const stops = ordered(await all("story_stops")).map((entry) => ({
		name: text(entry.data.photo_credit),
		url: text(entry.data.photo_credit_url),
	}));

	const candidates: Credit[] = [
		...walks.map((walk) => ({
			name: walk.photoCredit,
			url: walk.photoCreditUrl,
		})),
		...stops,
		...(home
			? [
					{ name: home.quoteCredit, url: home.quoteCreditUrl },
					{ name: home.clipCredit, url: home.clipCreditUrl },
				]
			: []),
	];

	const seen = new Set<string>();
	const credits: Credit[] = [];
	for (const credit of candidates) {
		const key = `${credit.name}|${credit.url}`;
		if (!credit.name || seen.has(key)) continue;
		seen.add(key);
		credits.push(credit);
	}
	return credits;
}

/* --------------------------------------------------------------- site name */

export async function getSiteName(): Promise<string> {
	try {
		const settings = await getSiteSettings();
		return settings.title?.trim() || "Saltwater";
	} catch {
		return "Saltwater";
	}
}
