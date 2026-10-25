import { ExtractedMediaResult, ExtractedMediaItem } from '../validation.js';

const DEFAULT_API_BASE = 'https://weirddl.sbs';

interface WeirdDLMediaRaw {
  type?: string;
  url?: string;
  width?: number;
  height?: number;
  duration?: number;
  ext?: string;
  hasAudio?: boolean;
  hasVideo?: boolean;
  thumbnail?: string;
}

interface WeirdDLResponse {
  ok: boolean;
  platform?: string;
  id?: string;
  title?: string;
  author?: string;
  thumbnail?: string;
  url?: string;
  media?: WeirdDLMediaRaw[];
  downloadUrl?: string;
  downloadExt?: string;
  error?: string;
  code?: string;
}

export async function extractWithWeirdDL(
  instagramUrl: string,
  apiBase: string = process.env.WEIRDDL_API_BASE || DEFAULT_API_BASE
): Promise<{ success: boolean; media?: ExtractedMediaResult; error?: string; code?: string }> {
  try {
    const endpoint = `${apiBase.replace(/\/+$/, '')}/api/info?url=${encodeURIComponent(instagramUrl)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'iGram-Downloader/1.0',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      if (response.status === 429) {
        return {
          success: false,
          error: 'The extraction service is currently receiving heavy traffic. Please wait a moment and try again.',
          code: 'upstream_rate_limited',
        };
      }
      return {
        success: false,
        error: `Provider responded with status ${response.status}. The requested media could not be resolved.`,
        code: `http_${response.status}`,
      };
    }

    const data = (await response.json()) as WeirdDLResponse;

    if (!data.ok) {
      const errorMsg = data.error || 'Failed to extract media from the provided Instagram link.';
      return {
        success: false,
        error: errorMsg.includes('No media')
          ? 'No downloadable media found. This post may be private, restricted, or an unsupported format.'
          : errorMsg,
        code: data.code || 'extraction_failed',
      };
    }

    // Media list extraction
    const mediaList: ExtractedMediaItem[] = [];
    if (Array.isArray(data.media) && data.media.length > 0) {
      for (const item of data.media) {
        if (item.url) {
          mediaList.push({
            type: item.type === 'video' ? 'video' : 'image',
            url: item.url,
            thumbnailUrl: item.thumbnail || data.thumbnail,
            width: item.width,
            height: item.height,
            duration: item.duration,
            ext: item.ext || (item.type === 'video' ? 'mp4' : 'jpg'),
            hasAudio: item.hasAudio,
          });
        }
      }
    }

    // Primary download URL fallback
    const primaryDownloadUrl = data.downloadUrl || (mediaList.length > 0 ? mediaList[0].url : '');
    const primaryThumbnail = data.thumbnail || (mediaList.length > 0 ? mediaList[0].thumbnailUrl : '') || '';

    if (!primaryDownloadUrl) {
      return {
        success: false,
        error: 'No direct media stream could be extracted from this post.',
        code: 'no_download_url',
      };
    }

    const isVideo = mediaList.length > 0 ? mediaList[0].type === 'video' : (data.downloadExt === 'mp4' || true);

    const result: ExtractedMediaResult = {
      id: data.id || 'ig_media',
      type: isVideo ? 'video' : 'image',
      title: data.title || 'Instagram Post',
      author: data.author ? `@${data.author.replace(/^@/, '')}` : undefined,
      thumbnailUrl: primaryThumbnail,
      downloadUrl: primaryDownloadUrl,
      downloadExt: data.downloadExt || (isVideo ? 'mp4' : 'jpg'),
      duration: mediaList.length > 0 ? mediaList[0].duration : undefined,
      width: mediaList.length > 0 ? mediaList[0].width : undefined,
      height: mediaList.length > 0 ? mediaList[0].height : undefined,
      hasAudio: mediaList.length > 0 ? mediaList[0].hasAudio : undefined,
      mediaList,
      provider: 'weirddl',
      extractedAt: new Date().toISOString(),
    };

    return {
      success: true,
      media: result,
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return {
        success: false,
        error: 'The request to the extraction provider timed out. Please try again.',
        code: 'timeout',
      };
    }
    return {
      success: false,
      error: 'An unexpected connection error occurred while contacting the media provider.',
      code: 'network_error',
    };
  }
}
