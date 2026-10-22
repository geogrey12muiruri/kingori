# Conversation catalogue sync

Set `YOUTUBE_API_KEY` in a gitignored `.env` at the repository root, or in the process environment, then run
`node scripts/conversations/sync-youtube.mjs` from the repository root.

The sync reads the public uploads playlist for `@LebrandKingori`, writes
`youtube-cache.json`, and regenerates `conversations.js` and
`category-counts.js`, and `category-highlights.js`. The API key is only used by
the local script; it is never written to generated files or sent to the browser.

YouTube supplies video titles, descriptions, publication dates, durations,
thumbnails, and view counts. The archive can sort videos by latest or most
viewed, but the site shows only three matches at a time. Homepage theme imagery
uses the newest available video thumbnail for each theme. These values refresh
when the sync command is run; the browser does not call YouTube directly.
Guest names and theme classifications remain editorial data. The importer
preserves guest and category values from the source inventory when titles
match. For future editorial corrections, add an entry keyed by YouTube video
ID in `editorial-overrides.json`, for example:

```json
{
  "VIDEO_ID": {
    "guests": ["Guest name"],
    "categories": ["money-wealth"],
    "topic": "A short editorial topic",
    "summary": "A reviewed teaser."
  }
}
```

Spotify episode IDs and thumbnail URLs are maintained in
`docs/content/podcasts.md`. The importer uses them to generate canonical
episode links and displays Spotify's episode artwork in the archive.

Keep `.env` private. `.gitignore` excludes it, and the Pages workflow does not upload it.
