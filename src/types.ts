export type DownloaderMode = 'video' | 'reels' | 'photo';

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

export interface ApiHealthResponse {
  status: string;
  service: string;
  timestamp: string;
  primaryProvider: string;
  providers: {
    weirddl: {
      configured: boolean;
      health: string;
    };
    alldl: {
      configured: boolean;
      health: string;
    };
  };
}

export type ModalType = 'privacy' | 'terms' | 'copyright' | 'contact' | null;
