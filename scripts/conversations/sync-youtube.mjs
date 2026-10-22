import { readFile, writeFile } from "node:fs/promises";
import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../..");
const cachePath = path.join(scriptDirectory, "youtube-cache.json");
const importerPath = path.join(scriptDirectory, "import-catalogue.mjs");

function parseEnv(source) {
  const values = new Map();
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    const value = match[2].replace(/^(["'])(.*)\1$/, "$2");
    values.set(match[1], value);
  }
  return values;
}

async function getApiKey() {
  if (process.env.YOUTUBE_API_KEY) return process.env.YOUTUBE_API_KEY;

  for (const envPath of [path.join(repositoryRoot, ".env")]) {
    try {
      const values = parseEnv(await readFile(envPath, "utf8"));
      const key = values.get("YOUTUBE_API_KEY");
      if (key) return key;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }

  throw new Error("YOUTUBE_API_KEY is not configured. Add it to the repository-root .env or the process environment.");
}

function parseDuration(isoDuration) {
  const match = isoDuration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return null;
  return Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
}

async function youtubeRequest(resource, parameters, apiKey) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${resource}`);
  for (const [name, value] of Object.entries({ ...parameters, key: apiKey })) {
    url.searchParams.set(name, value);
  }

  let responseText;
  try {
    responseText = execFileSync(
      "curl",
      ["--silent", "--show-error", "--max-time", "30", "--write-out", "\n%{http_code}", "--config", "-"],
      {
        encoding: "utf8",
        input: `url = ${JSON.stringify(url.toString())}\n`,
        maxBuffer: 10 * 1024 * 1024,
      },
    );
  } catch (error) {
    const message = String(error?.message ?? error).replaceAll(apiKey, "[redacted]");
    throw new Error(`Could not reach the YouTube API. Check network access. Details: ${message}`, { cause: error });
  }

  const statusMatch = responseText.match(/\n(\d{3})$/);
  if (!statusMatch) throw new Error("The YouTube API returned an unreadable response.");
  const status = Number(statusMatch[1]);
  const payload = JSON.parse(responseText.slice(0, statusMatch.index));
  if (status < 200 || status >= 300) {
    const code = payload.error?.code ?? status;
    const message = String(payload.error?.message ?? `HTTP ${status}`).replaceAll(apiKey, "[redacted]");
    throw new Error(`YouTube API request failed (${code}): ${message}`);
  }
  return payload;
}

const apiKey = await getApiKey();
const channel = await youtubeRequest(
  "channels",
  { part: "contentDetails", forHandle: "LebrandKingori" },
  apiKey,
);
const channelDetails = channel.items?.[0];
if (!channelDetails) {
  throw new Error("The YouTube API did not find the channel @LebrandKingori.");
}

const uploadsPlaylistId = channelDetails.contentDetails?.relatedPlaylists?.uploads;
if (!uploadsPlaylistId) {
  throw new Error("The YouTube channel response did not include its uploads playlist.");
}

const playlistItems = [];
let pageToken;
do {
  const page = await youtubeRequest(
    "playlistItems",
    {
      part: "snippet,contentDetails",
      playlistId: uploadsPlaylistId,
      maxResults: "50",
      ...(pageToken ? { pageToken } : {}),
    },
    apiKey,
  );
  playlistItems.push(...(page.items ?? []));
  pageToken = page.nextPageToken;
} while (pageToken);

const playlistVideoIds = playlistItems
  .map((item) => item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId)
  .filter(Boolean);
const videos = [];
for (let index = 0; index < playlistVideoIds.length; index += 50) {
  const batch = playlistVideoIds.slice(index, index + 50);
  const details = await youtubeRequest(
    "videos",
    { part: "snippet,contentDetails,statistics", id: batch.join(",") },
    apiKey,
  );
  videos.push(...(details.items ?? []));
}

const videoById = new Map(videos.map((video) => [video.id, video]));
const records = playlistItems.flatMap((item, index) => {
  const videoId = item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId;
  const video = videoById.get(videoId);
  if (!video) return [];

  const thumbnails = video.snippet.thumbnails ?? {};
  const thumbnail = thumbnails.maxres ?? thumbnails.standard ?? thumbnails.high ?? thumbnails.medium ?? thumbnails.default;
  return [{
    videoId,
    playlistOrder: index + 1,
    title: video.snippet.title,
    description: video.snippet.description ?? "",
    publishedAt: video.snippet.publishedAt ?? null,
    durationSeconds: parseDuration(video.contentDetails.duration),
    viewCount: Number(video.statistics.viewCount ?? 0),
    thumbnailUrl: thumbnail?.url ?? null,
    mediaUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
  }];
});

if (records.length !== playlistItems.length) {
  console.warn(`YouTube returned details for ${records.length} of ${playlistItems.length} playlist entries.`);
}

await writeFile(
  cachePath,
  `${JSON.stringify({
    channelId: channelDetails.id,
    syncedAt: new Date().toISOString(),
    records,
  }, null, 2)}\n`,
);

const importResult = spawnSync(process.execPath, [importerPath], { cwd: repositoryRoot, stdio: "inherit" });
if (importResult.error) throw importResult.error;
if (importResult.status !== 0) {
  throw new Error(`Catalogue generation failed with exit code ${importResult.status}.`);
}

console.log(`Synced ${records.length} public YouTube videos and regenerated the local catalogue.`);
