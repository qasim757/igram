import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { extractRequestSchema, validateInstagramUrl, ExtractionResponse } from './src/server/validation.js';
import { extractWithWeirdDL } from './src/server/providers/weirddl.js';
import { extractWithAllDL } from './src/server/providers/alldl.js';
import { rateLimiter } from './src/server/rateLimiter.js';
import { handleDownloadStream } from './src/server/proxy.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Basic security and parsing middlewares
app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

/**
 * Health check endpoint
 * GET /api/health
 */
app.get('/api/health', async (_req, res) => {
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
app.post('/api/extract', rateLimiter, async (req, res) => {
  // 1. Zod input parsing
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

  // 2. Strict Instagram domain & format validation
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
        // Fallback to WeirdDL
        const fallback = await extractWithWeirdDL(cleanUrl);
        if (fallback.success) {
          result = fallback;
        }
      }
    } else {
      // Primary: WeirdDL
      result = await extractWithWeirdDL(cleanUrl);
      if (!result.success) {
        // Fallback to AllDL
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
app.get('/api/download-stream', handleDownloadStream);

/**
 * Mount Vite in dev mode or static files in production
 */
async function startServer() {
  if (isProd) {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[iGram Server] running on http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[iGram Server] Failed to start:', err);
  process.exit(1);
});
