import { Recipe } from '../types';

/**
 * Parses an individual input (URL, iframe embed, raw ID, query string, etc.)
 * and extracts a valid 11-character YouTube video ID.
 */
function parseSingleCandidate(candidate?: string | null): string | null {
  if (!candidate) return null;
  let str = String(candidate).trim();
  if (!str) return null;

  //  If user pasted full iframe embed code: <iframe ... src="..." ...>
  if (str.includes('<iframe') || str.includes('src=')) {
    const srcMatch = str.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      str = srcMatch[1].trim();
    }
  }

  // Pure 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    return str;
  }

  //  Path patterns: youtu.be/ID, youtube.com/embed/ID, /v/ID, /shorts/ID, /live/ID
  const pathMatch = str.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed|v|shorts|live)\/)([a-zA-Z0-9_-]{11})/i
  );
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1];
  }

  //  Query param: ?v=ID or &v=ID
  const queryMatch = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  if (queryMatch && queryMatch[1]) {
    return queryMatch[1];
  }

  //  Broad fallback regex
  const broad = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|live\/|\&v=)([^#\&\?\/]*).*/;
  const broadMatch = str.match(broad);
  if (broadMatch && broadMatch[2] && broadMatch[2].length === 11) {
    return broadMatch[2];
  }

  return null;
}

/**
 * Bulletproof extraction of YouTube video ID from any number of candidates
 * (URL, raw video ID, iframe code, alternative property names).
 * Evaluates each candidate in order until a valid 11-character ID is found.
 */
export function extractYoutubeId(
  ...candidates: (string | null | undefined)[]
): string | null {
  for (const candidate of candidates) {
    const parsed = parseSingleCandidate(candidate);
    if (parsed) return parsed;
  }
  return null;
}

/**
 * Normalizes a recipe to guarantee `youtubeUrl` and `youtubeVideoId` are synchronized.
 * If the database has null or empty video fields, it strictly respects the deletion.
 */
export function normalizeRecipe(r: any): Recipe {
  if (!r) return r;

  const hasExplicitEmptyVideo =
    r.youtubeVideoId === null ||
    r.youtube_video_id === null ||
    r.youtubeVideoId === '' ||
    r.youtube_video_id === '';

  const derivedId = hasExplicitEmptyVideo
    ? undefined
    : extractYoutubeId(
        r.youtubeVideoId,
        r.youtube_video_id,
        r.youtubeUrl,
        r.youtube_url,
        r.videoId,
        r.videoUrl
      ) || undefined;

  const rawUrl = hasExplicitEmptyVideo
    ? undefined
    : (r.youtubeUrl && String(r.youtubeUrl).startsWith('http') ? r.youtubeUrl : undefined) ||
      (r.youtube_url && String(r.youtube_url).startsWith('http') ? r.youtube_url : undefined) ||
      (r.youtube_video_id && String(r.youtube_video_id).startsWith('http') ? r.youtube_video_id : undefined);

  const derivedUrl =
    rawUrl || (derivedId ? `https://www.youtube.com/watch?v=${derivedId}` : undefined);

  return {
    ...r,
    youtubeUrl: derivedUrl,
    youtubeVideoId: derivedId,
  };
}
