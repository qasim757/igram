import { Router } from 'express';
import { extractRequestSchema, validateInstagramUrl, ExtractionResponse } from './validation.js';
import { extractWithWeirdDL } from './providers/weirddl.js';
import { extractWithAllDL } from './providers/alldl.js';
import { rateLimiter } from './rateLimiter.js';
import { handleDownloadStream } from './proxy.js';

export const apiRouter = Router();

/**
 * Health check endpoint
 * GET /api/health
 */
apiRouter.get('/health', async (_req, res) => {
  let weirdDlStatus = 'unknown';
  try {
    const healthRes = await fetch(`${process.env.WEIRDDL_API_BASE || 'https://weirddl.sbs'}/api/health`, {
      signal: AbortSignal.timeout(3000),
    });
    weirdDlStatus = healthRes.ok ? 'connected' : `status_${healthRes.status}`;
  } catch {
    weirdDlStatus = 'unreachable';
  }

  res.json({
    status: 'healthy',
    service: 'iGram Instagram Downloader API',
    timestamp: new Date().toISOString(),
    primaryProvider: process.env.PRIMARY_PROVIDER || 'weirddl',
    providers: {
      weirddl: {
        configured: true,
        health: weirdDlStatus,
      },
      alldl: {
        configured: true,
        health: 'ready',
      },
    },
  });
});

/**
 * Extraction endpoint
 * POST /api/extract
 */
apiRouter.post('/extract', rateLimiter, async (req, res) => {
  const parseResult = extractRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    const firstError = parseResult.error.issues?.[0]?.message || 'Invalid request body';
    return res.status(400).json({
      success: false,
      error: firstError,
      code: 'validation_error',
    } satisfies ExtractionResponse);
  }

  const { url, provider: requestedProvider } = parseResult.data;

  const validation = validateInstagramUrl(url);
  if (!validation.isValid || !validation.normalizedUrl) {
    return res.status(400).json({
      success: false,
      error: validation.error || 'Invalid Instagram URL format.',
      code: 'invalid_url',
    } satisfies ExtractionResponse);
  }

  const cleanUrl = validation.normalizedUrl;
  const primaryChoice = requestedProvider || process.env.PRIMARY_PROVIDER || 'weirddl';

  try {
    let result;

    if (primaryChoice === 'alldl') {
      result = await extractWithAllDL(cleanUrl);
      if (!result.success) {
        const fallback = await extractWithWeirdDL(cleanUrl);
        if (fallback.success) {
          result = fallback;
        }
      }
    } else {
      result = await extractWithWeirdDL(cleanUrl);
      if (!result.success) {
        const fallback = await extractWithAllDL(cleanUrl);
        if (fallback.success) {
          result = fallback;
        }
      }
    }

    if (!result.success) {
      return res.status(422).json({
        success: false,
        error: result.error || 'Failed to extract media. The post may be private, age-restricted, or removed.',
        code: result.code || 'extraction_failed',
      } satisfies ExtractionResponse);
    }

    return res.json({
      success: true,
      media: result.media,
    } satisfies ExtractionResponse);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return res.status(500).json({
      success: false,
      error: `Internal server error during media processing: ${message}`,
      code: 'internal_error',
    } satisfies ExtractionResponse);
  }
});

/**
 * Secure media stream / download endpoint
 * GET /api/download-stream?url=...&filename=...
 */
apiRouter.get('/download-stream', handleDownloadStream);
