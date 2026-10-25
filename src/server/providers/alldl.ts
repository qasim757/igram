import { ExtractedMediaResult } from '../validation.js';

const DEFAULT_API_BASE = 'https://ahm7xmakki.com';

interface AllDLMediaInfo {
  title?: string | null;
  author?: string | null;
  thumbnail?: string | null;
  videoUrl?: string | null;
  coverImage?: string | null;
  duration?: number | null;
  platform?: string | null;
}

interface AllDLResponse {
  success: boolean;
  message?: string;
  mediaInfo?: AllDLMediaInfo;
}

export async function extractWithAllDL(
  instagramUrl: string,
  apiBase: string = process.env.ALLDL_API_BASE || DEFAULT_API_BASE
): Promise<{ success: boolean; media?: ExtractedMediaResult; error?: string; code?: string }> {
  try {
    const endpoint = `${apiBase.replace(/\/+$/, '')}/api/alldl?url=${encodeURIComponent(instagramUrl)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 16000); // AllDL can take up to 12s

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
      return {
        success: false,
        error: `AllDL provider returned status ${response.status}`,
        code: `http_${response.status}`,
      };
    }

    const data = (await response.json()) as AllDLResponse;

    if (!data.success || !data.mediaInfo) {
      return {
        success: false,
        error: data.message || 'Unable to extract media using AllDL provider.',
        code: 'alldl_extract_failed',
      };
    }

    const downloadUrl = data.mediaInfo.videoUrl;
    const thumbnail = data.mediaInfo.thumbnail || data.mediaInfo.coverImage || '';

    if (!downloadUrl) {
      return {
        success: false,
        error: 'AllDL provider did not return a valid video stream link.',
        code: 'no_video_url',
      };
    }

    const result: ExtractedMediaResult = {
      id: 'alldl_ig_media',
      type: 'video',
      title: data.mediaInfo.title || 'Instagram Video',
      author: data.mediaInfo.author ? `@${data.mediaInfo.author}` : undefined,
      thumbnailUrl: thumbnail,
      downloadUrl: downloadUrl,
      downloadExt: 'mp4',
      duration: data.mediaInfo.duration || undefined,
      mediaList: [
        {
          type: 'video',
          url: downloadUrl,
          thumbnailUrl: thumbnail,
          ext: 'mp4',
        },
      ],
      provider: 'alldl',
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
        error: 'The request to AllDL timed out. Please try again or switch to WeirdDL.',
        code: 'timeout',
      };
    }
    return {
      success: false,
      error: 'An unexpected connection error occurred with AllDL.',
      code: 'network_error',
    };
  }
}
