import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'Eventify backend is running.' });
});

app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;
