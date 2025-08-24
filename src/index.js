import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { getDb } from './db.js';

import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import appointmentRoutes from './routes/appointments.js';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Warm up DB and ensure schema
getDb().then(() => console.log('SQLite ready ✅')).catch(console.error);

// Routes
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRoutes);
app.use('/services', serviceRoutes);
app.use('/appointments', appointmentRoutes);

// 404
app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
