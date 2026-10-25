import { z } from 'zod';

export const extractRequestSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, 'Please enter an Instagram URL')
    .max(2048, 'URL is too long'),
  provider: z.enum(['weirddl', 'alldl']).optional().default('weirddl'),
});

export type ExtractRequest = z.infer<typeof extractRequestSchema>;

export interface ExtractedMediaItem {
  type: 'video' | 'image';
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
  ext?: string;
  hasAudio?: boolean;
}

export interface ExtractedMediaResult {
  id: string;
  type: 'video' | 'image' | 'carousel';
  title?: string;
  author?: string;
  thumbnailUrl: string;
  downloadUrl: string;
  downloadExt: string;
  duration?: number;
  width?: number;
  height?: number;
  hasAudio?: boolean;
  mediaList: ExtractedMediaItem[];
  provider: 'weirddl' | 'alldl';
  extractedAt: string;
}

export interface ExtractionResponse {
  success: boolean;
  media?: ExtractedMediaResult;
  error?: string;
  code?: string;
  provider?: string;
}

/**
 * Validates and sanitizes an Instagram URL.
 * Enforces strict domain whitelist to prevent SSRF and invalid inputs.
 */
export function validateInstagramUrl(rawUrl: string): { isValid: boolean; normalizedUrl?: string; error?: string } {
  try {
    let urlToParse = rawUrl.trim();
    if (!urlToParse.startsWith('http://') && !urlToParse.startsWith('https://')) {
      urlToParse = 'https://' + urlToParse;
    }

    const parsed = new URL(urlToParse);

    // Enforce HTTPS
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return { isValid: false, error: 'Only HTTP and HTTPS protocols are supported.' };
    }

    // Hostname check: must be instagram.com, instagr.am, or subdomain
    const hostname = parsed.hostname.toLowerCase();
    const isInstagramHost =
      hostname === 'instagram.com' ||
      hostname === 'www.instagram.com' ||
      hostname === 'm.instagram.com' ||
      hostname === 'instagr.am';

    if (!isInstagramHost) {
      return {
        isValid: false,
        error: 'Invalid domain. Please provide a link from instagram.com (e.g. https://www.instagram.com/reel/...)',
      };
    }

    // Path check: must contain /p/, /reel/, /reels/, /tv/
    const path = parsed.pathname;
    const isSupportedPath = /^\/(p|reel|reels|tv)\/([a-zA-Z0-9_-]+)/.test(path);

    if (!isSupportedPath) {
      return {
        isValid: false,
        error:
          'Unsupported Instagram content type. iGram supports public Instagram Reels, Videos, and Posts (/reel/, /reels/, /p/, /tv/). Stories and profile links are not supported.',
      };
    }

    // Clean tracking query params to avoid downstream extraction issues
    const cleanUrl = `${parsed.protocol}//${parsed.hostname}${parsed.pathname}`;
    return { isValid: true, normalizedUrl: cleanUrl };
  } catch {
    return { isValid: false, error: 'Malformed URL. Please check the link and try again.' };
  }
}
