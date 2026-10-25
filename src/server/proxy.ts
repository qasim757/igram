import { Request, Response } from 'express';
import { Readable } from 'stream';

const ALLOWED_MEDIA_DOMAINS = [
  'cdninstagram.com',
  'fbcdn.net',
  'rapidcdn.app',
  'weirddl.sbs',
];

function isAllowedDomain(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return ALLOWED_MEDIA_DOMAINS.some(
    (allowed) => host === allowed || host.endsWith('.' + allowed)
  );
}

export async function handleDownloadStream(req: Request, res: Response) {
  try {
    const mediaUrl = req.query.url;
    const rawFilename = (req.query.filename as string) || 'igram_download.mp4';

    if (typeof mediaUrl !== 'string' || !mediaUrl.trim()) {
      return res.status(400).json({ error: 'Missing media URL parameter.' });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(mediaUrl);
    } catch {
      return res.status(400).json({ error: 'Invalid media URL.' });
    }

    if (parsedUrl.protocol !== 'https:') {
      return res.status(400).json({ error: 'Only secure HTTPS media streams are allowed.' });
    }

    if (!isAllowedDomain(parsedUrl.hostname)) {
      return res.status(403).json({
        error: 'Access denied: Target media host is not in the authorized media domain list.',
      });
    }

    // Sanitize filename to prevent header injection
    const sanitizedFilename = rawFilename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(0, 100);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const upstreamRes = await fetch(parsedUrl.toString(), {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: '*/*',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!upstreamRes.ok || !upstreamRes.body) {
      return res.status(upstreamRes.status || 502).json({
        error: `Upstream media server returned error ${upstreamRes.status}. Media may have expired.`,
      });
    }

    const contentType = upstreamRes.headers.get('content-type') || 'application/octet-stream';
    const contentLength = upstreamRes.headers.get('content-length');

    // Limit size to 150MB to protect server memory/bandwidth
    if (contentLength && parseInt(contentLength, 10) > 150 * 1024 * 1024) {
      return res.status(413).json({ error: 'Media exceeds the 150MB download size limit.' });
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFilename}"`);
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    // Pipe Web ReadableStream to Node Writable stream
    // @ts-expect-error Node.js Readable.fromWeb accepts WebStream
    const nodeStream = Readable.fromWeb(upstreamRes.body);
    nodeStream.pipe(res);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return res.status(504).json({ error: 'Media stream request timed out.' });
    }
    if (!res.headersSent) {
      return res.status(500).json({ error: 'An error occurred while streaming media.' });
    }
  }
}
