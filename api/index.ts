import express from 'express';
import { apiRouter } from '../src/server/api.js';

const app = express();

app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Support both /api/... (when rewritten) and direct /... calls
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
