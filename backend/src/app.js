import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import adminRoutes from './routes/adminRoutes.js';
import attendeeRoutes from './routes/attendeeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

const app = express();

const allowedOrigins = new Set([
  env.clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

if (env.clientUrl.includes('localhost')) {
  allowedOrigins.add(env.clientUrl.replace('localhost', '127.0.0.1'));
}

if (env.clientUrl.includes('127.0.0.1')) {
  allowedOrigins.add(env.clientUrl.replace('127.0.0.1', 'localhost'));
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'Eventify backend is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/attendee', attendeeRoutes);

app.use(errorHandler);

export default app;
