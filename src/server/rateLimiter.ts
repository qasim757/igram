import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const windowMs = 60 * 1000; // 1 minute window
const maxRequests = 20; // 20 requests per minute per IP
const ipRecords = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRecords.entries()) {
    if (now > record.resetTime) {
      ipRecords.delete(ip);
    }
  }
}, 30 * 1000);

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress) || 'unknown';

  const now = Date.now();
  let record = ipRecords.get(ip);

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + windowMs,
    };
    ipRecords.set(ip, record);
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
    return next();
  }

  if (record.count >= maxRequests) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    res.setHeader('Retry-After', retryAfter);
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', 0);
    return res.status(429).json({
      success: false,
      error: `Too many requests. Please wait ${retryAfter} seconds before requesting another download.`,
      code: 'rate_limit_exceeded',
    });
  }

  record.count++;
  res.setHeader('X-RateLimit-Limit', maxRequests);
  res.setHeader('X-RateLimit-Remaining', maxRequests - record.count);
  next();
}
