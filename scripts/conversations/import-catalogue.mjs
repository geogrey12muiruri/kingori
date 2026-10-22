import { access, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { categories } from "./categories.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cataloguePath = path.join(projectRoot, "docs/content/content.md");
const podcastsPath = path.join(projectRoot, "docs/content/podcasts.md");
const outputPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "conversations.js");
const categoryCountsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "category-counts.js");
const categoryHighlightsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "category-highlights.js");
const youtubeCachePath = path.join(path.dirname(fileURLToPath(import.meta.url)), "youtube-cache.json");
const editorialOverridesPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "editorial-overrides.json");

const platformUrls = {
  video: "https://www.youtube.com/@LebrandKingori",
  audio: "https://open.spotify.com/show/5LmRSFz7JvyE0gGiOT6Xpd",
};

const categoryRules = [
  ["money-wealth", /\b(money|wealth|rich|poor|poverty|financial|finance|invest(?:ment|ing)?|saving(?:s)?|debt|loan|cash|salary|millionaire|broke|bank(?:er|ers|ing)?|funds?|econom(?:y|ic)|income|tax|crypto|stock|capital|budget|spend(?:ing)?|borrow|lump sum|wage|cost of living|forex|million|wealthy|riches|millionaires|pay(?:ing)? more|breadwinner|trust fund|rent free|stocks? & options|money game|afford land)\b/i],
  ["business-enterprise", /\b(business(?:es)?|entrepreneur(?:ship)?|enterprise|small businesses|sme|trade|export(?:er|s)?|agribusiness|real estate|company|ceo|founder|startup|side hustles?|retail|industry|shop|supplier|corporate|banker|content business|construction|housing|million(?:s)? from trash|starting small|sales pioneer|jack of all trades)\b/i],
  ["careers-opportunity", /\b(employ(?:ment|ee|er)?|jobs?|jobless|job security|career|profession(?:al)?|degree|skills?|workplace|nurse|teacher|engineer|opportunity|promotion|hiring|work ethic|internship|unemploy|networking|pr legend|million jobs|sniper training|university|training|work|leave your country|canada)\b/i],
  ["politics-power", /\b(politic(?:s|al|ian)?|power|election|govern(?:ment|ance)|president|minister|mp\b|senator|parliament|public policy|leadership|state capture|campaign|vote|war|military|police operation|impeach|ruto|rigathi|county|authority|regime|diplomat|news|reporting on corruption|corruption|sniper)\b/i],
  ["society-justice", /\b(societ(?:y|al)|justice|crime|criminal|murder|kill(?:ing)?|police|inequalit|systemic|poverty|rights|accountab|corrupt|security|law\b|court|prison|tribe|tribal|racis|discriminat|public institution|community|social issue|children|education|homeless|human trafficking|university|kamiti|beyond reasonable doubt|news|flight|disaster|poverty|reality|reality of reporting|society|country)\b/i],
  ["health-behaviour", /\b(health|medicine|medical|psycholog|neuroscien|brain|biology|happiness|mental|wellbeing|well-being|gym|fitness|sleep|sex\b|sexual|body|weight|diet|addict|drug|cancer|disease|doctor|nurse|healthy|sick|stress|trauma|behavio?ur|human nature|emotion|anxiety|depression|therapy|pregnan|birth|nutrition|aging|ageing|marijuana|alcohol|curves|super human|how long you will live|3am|reality|s£x)\b/i],
  ["relationships-life", /\b(relation|marriage|marry|couple|dating|love\b|family|wife|husband|divorce|parent|childhood|children|life\b|destiny|personal development|friendship|home\b|sex\b|cheating|lonely|loneliness|raising|sibling|romance|breakup|loyalty test|kugongewa|breadwinner|leaving canada|losing everything|reset your life|left canada)\b/i],
  ["faith-spirituality", /\b(faith|spiritual|religio|religion|witchcraft|god\b|christian|church|priest|pastor|apostle|satan|bible|belief|soul|prayer|miracle|prophet|meaning of life|supernatural|cult\b|atheis|satanism)\b/i],
  ["technology-innovation", /\b(technology|technolog|innovation|engineering|engineer|digital|internet|artificial intelligence|\bai\b|software|app\b|smartphone|cryptocurrency|crypto|machine|robot|electric car|car modification|automotive|data science|cyber|social media|online platform|coding|electronic devices|computer sales|watch sends)\b/i],
  ["culture-identity", /\b(cultur|identity|music|rapper|rappers|artist|entertain|media\b|comedy|comedian|actor|film|tv\b|fame|celebrity|fashion|influencer|content creat|radio|dance|football|sport|africa|african|tribe|tribal|language|race\b|nationality|famous|news|pr legend|reality)\b/i],
];

function cleanText(value) {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function durationToSeconds(label) {
  const clock = label.match(/^(?:(\d+):)?(\d{1,2}):(\d{2})$/);
  if (clock) {
    return Number(clock[1] ?? 0) * 3600 + Number(clock[2]) * 60 + Number(clock[3]);
  }

  const hours = label.match(/(\d+)\s*hr/);
  const minutes = label.match(/(\d+)\s*min/);
  const seconds = label.match(/(\d+)\s*sec/);

  if (!hours && !minutes && !seconds) return null;
  return Number(hours?.[1] ?? 0) * 3600 + Number(minutes?.[1] ?? 0) * 60 + Number(seconds?.[1] ?? 0);
}

function mapCategories(text) {
  return categoryRules
    .filter(([, pattern]) => pattern.test(text))
    .map(([slug]) => slug)
    .slice(0, 3);
}

function formatDuration(seconds) {
  if (!Number.isInteger(seconds) || seconds <= 0) return null;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return [
    ...(hours ? [String(hours)] : []),
    String(minutes).padStart(2, "0"),
    String(remainingSeconds).padStart(2, "0"),
  ].join(":");
}

function normalizeTitle(title) {
  return slugify(title).replace(/-/g, "");
}

function parseYoutubeCatalogue(markdown) {
  const lines = markdown.split(/\r?\n/);
  const entries = [];
  const usedIds = new Set();

  for (let index = 0; index < lines.length; index += 1) {
    const row = lines[index].match(/^\s+(\d+)\s+(\d+:\d{2}(?::\d{2})?)\s+/);
    if (!row) continue;

    const sourceOrder = Number(row[1]);
    const duration = row[2];
    let title = "";
    let guestText = "";
    const appendColumns = (line) => {
      title += ` ${line.slice(30, 48).trim()}`;
      guestText += ` ${line.slice(48, 65).trim()}`;
    };

    appendColumns(lines[index]);
    while (
      index + 1 < lines.length &&
      !/^\s+\d+\s+\d+:\d{2}(?::\d{2})?\s+/.test(lines[index + 1]) &&
      lines[index + 1].trim()
    ) {
      appendColumns(lines[index + 1]);
      index += 1;
    }

    const cleanTitle = cleanText(title);
    const cleanGuest = cleanText(guestText);
    const guests = cleanGuest.includes("Not separately identified in source")
      ? []
      : cleanGuest
        ? [cleanGuest]
        : [];
    const baseId = `video-${slugify(cleanTitle)}`;
    const id = usedIds.has(baseId) ? `${baseId}-${sourceOrder}` : baseId;
    usedIds.add(id);

    entries.push({
      id,
      format: "video",
      title: cleanTitle,
      topic: null,
      guests,
      host: "Dr. King’ori",
      summary: null,
      fullDescription: null,
      sourceDescription: null,
      releaseDate: null,
      durationSeconds: durationToSeconds(duration),
      durationLabel: duration,
      thumbnailUrl: null,
      categories: mapCategories(`${cleanTitle} ${cleanGuest}`),
      mediaUrl: null,
      platformUrl: platformUrls.video,
      editorialStatus: "provisional",
      source: {
        type: "youtube-playlist",
        order: sourceOrder,
        guestStatus: guests.length ? "listed-in-source" : "not-separated-in-source",
      },
    });
  }

  return entries;
}

function parseYoutubeApiCatalogue(cache, legacyEntries, editorialOverrides) {
  const legacyByTitle = new Map(
    legacyEntries.map((entry) => [normalizeTitle(entry.title), entry]),
  );

  return cache.records.map((record) => {
    const [videoTitle, listedGuest = ""] = cleanText(record.title).split(/\s+\|\|\s+/, 2);
    const title = cleanText(videoTitle);
    const legacy = legacyByTitle.get(normalizeTitle(title));
    const editorial = editorialOverrides[record.videoId] ?? {};
    const guests = Array.isArray(editorial.guests)
      ? editorial.guests
      : legacy?.guests.length
      ? legacy.guests
      : listedGuest
        ? [cleanText(listedGuest)]
        : [];
    const categories = Array.isArray(editorial.categories)
      ? editorial.categories
      : legacy?.categories.length
        ? legacy.categories
        : mapCategories(`${title} ${record.description} ${guests.join(" ")}`);
    const releaseDate = record.publishedAt?.slice(0, 10) ?? null;

    return {
      id: `video-${record.videoId}`,
      format: "video",
      title,
      topic: editorial.topic ?? null,
      guests,
      host: "Dr. King’ori",
      summary: editorial.summary ?? null,
      fullDescription: null,
      sourceDescription: record.description || null,
      releaseDate,
      durationSeconds: record.durationSeconds,
      durationLabel: formatDuration(record.durationSeconds),
      thumbnailUrl: record.thumbnailUrl,
      viewCount: Number.isInteger(record.viewCount) ? record.viewCount : null,
      categories,
      mediaUrl: record.mediaUrl,
      platformUrl: platformUrls.video,
      editorialStatus: Object.hasOwn(editorialOverrides, record.videoId)
        ? "reviewed"
        : categories.length
          ? "provisional"
          : "needs-editorial-review",
      source: {
        type: "youtube-api",
        order: record.playlistOrder,
        videoId: record.videoId,
        guestStatus: guests.length ? "editorially-confirmed" : "not-confirmed",
      },
    };
  });
}

function parsePodcastCatalogue(markdown) {
  const sourceEntries = JSON.parse(markdown);

  return sourceEntries.map((entry) => {
    const title = cleanText(entry.title.split("||")[0]);
    const guests = Array.isArray(entry.guests) ? entry.guests.map(cleanText) : [];
    const durationLabel = cleanText(entry.duration ?? "");
    const spotifyEpisodeId = typeof entry.spotifyEpisodeId === "string" &&
      /^[A-Za-z0-9]{22}$/.test(entry.spotifyEpisodeId)
      ? entry.spotifyEpisodeId
      : null;

    return {
      id: `audio-${slugify(title)}`,
      format: "audio",
      title,
      topic: entry.topic ?? null,
      guests,
      host: "Dr. King’ori",
      summary: null,
      fullDescription: null,
      sourceDescription: entry.description ?? null,
      releaseDate: entry.releaseDate ?? null,
      durationSeconds: durationToSeconds(durationLabel),
      durationLabel,
      thumbnailUrl: entry.thumbnailUrl ?? null,
      viewCount: null,
      categories: mapCategories(`${title} ${entry.description ?? ""} ${guests.join(" ")}`),
      mediaUrl: spotifyEpisodeId
        ? `https://open.spotify.com/episode/${spotifyEpisodeId}`
        : null,
      platformUrl: platformUrls.audio,
      editorialStatus: "provisional",
      source: {
        type: "spotify-show-list",
        sourceId: entry.id,
        imageStatus: entry.thumbnailUrl ? "spotify-oembed" : "not-provided",
        linkStatus: spotifyEpisodeId ? "verified-episode-url" : "episode-url-not-provided",
      },
    };
  });
}

async function readJsonIfPresent(filePath, fallback) {
  try {
    await access(filePath);
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

const [youtubeMarkdown, podcastMarkdown] = await Promise.all([
  readFile(cataloguePath, "utf8"),
  readFile(podcastsPath, "utf8"),
]);
const [youtubeCache, editorialOverrides] = await Promise.all([
  readJsonIfPresent(youtubeCachePath, null),
  readJsonIfPresent(editorialOverridesPath, {}),
]);
const legacyYoutubeEntries = parseYoutubeCatalogue(youtubeMarkdown);
const youtubeEntries = youtubeCache
  ? parseYoutubeApiCatalogue(youtubeCache, legacyYoutubeEntries, editorialOverrides)
  : legacyYoutubeEntries;
const conversations = [
  ...youtubeEntries,
  ...parsePodcastCatalogue(podcastMarkdown),
];
const ids = new Set(conversations.map(({ id }) => id));
const invalidRecords = conversations.filter((entry) =>
  !entry.title ||
  !entry.format ||
  !entry.id ||
  !Array.isArray(entry.guests) ||
  !Array.isArray(entry.categories) ||
  entry.categories.length > 3 ||
  !Number.isInteger(entry.durationSeconds) ||
  entry.durationSeconds <= 0 ||
  (entry.releaseDate !== null && !/^\d{4}-\d{2}-\d{2}$/.test(entry.releaseDate)) ||
  !entry.categories.every((slug) => categories.some((category) => category.slug === slug)) ||
  !ids.has(entry.id)
);

if (invalidRecords.length || ids.size !== conversations.length) {
  throw new Error(
    `Catalogue import produced ${invalidRecords.length} invalid records or duplicate IDs (${ids.size} unique IDs for ${conversations.length} records).`,
  );
}

await writeFile(
  outputPath,
  `export const conversations = ${JSON.stringify(conversations, null, 2)};\n`,
);

const categoryCounts = Object.fromEntries(
  categories.map(({ slug }) => [
    slug,
    conversations.filter((entry) => entry.categories.includes(slug)).length,
  ]),
);
const categoryHighlights = Object.fromEntries(
  categories.map(({ slug }) => {
    const highlight = youtubeEntries
      .filter((entry) => entry.categories.includes(slug) && entry.thumbnailUrl)
      .sort((first, second) => (second.releaseDate ?? "").localeCompare(first.releaseDate ?? ""))[0];
    return [
      slug,
      highlight
        ? { title: highlight.title, guest: highlight.guests[0] ?? "", thumbnailUrl: highlight.thumbnailUrl }
        : null,
    ];
  }),
);
const unclassified = conversations.filter((entry) => entry.categories.length === 0).length;
await writeFile(
  categoryCountsPath,
  `export const categoryCounts = ${JSON.stringify(categoryCounts, null, 2)};\n`,
);
await writeFile(
  categoryHighlightsPath,
  `export const categoryHighlights = ${JSON.stringify(categoryHighlights, null, 2)};\n`,
);

console.log(
  `Imported ${conversations.length} records (${youtubeEntries.length} video, ${parsePodcastCatalogue(podcastMarkdown).length} audio).`,
);
console.log(`Unclassified records: ${unclassified}. All category assignments remain provisional pending editorial review.`);
console.log("Provisional category assignment counts:", categoryCounts);
