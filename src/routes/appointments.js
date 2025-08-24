import { Router } from 'express';
import { getDb } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { appointmentSchema } from '../validators/index.js';

const router = Router();

// List current user's appointments
router.get('/', authRequired(), async (req, res) => {
  const db = await getDb();
  const rows = await db.all(
    `SELECT a.*, s.name as service_name 
     FROM appointments a
     JOIN services s ON s.id = a.service_id
     WHERE a.user_id = ?
     ORDER BY a.starts_at DESC`,
    [req.user.id]
  );
  res.json(rows);
});

// Create appointment
router.post('/', authRequired(), async (req, res) => {
  try {
    const data = appointmentSchema.parse(req.body);

    // Enforce ownership
    if (data.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Cannot create for another user' });
    }

    const db = await getDb();

    // Get service for duration
    const service = await db.get('SELECT * FROM services WHERE id = ?', [data.service_id]);
    if (!service) return res.status(400).json({ error: 'Service not found' });

    const starts = new Date(data.starts_at);
    const ends = new Date(starts.getTime() + service.duration_min * 60000);

    // Optional: basic overlap check
    const overlap = await db.get(
      `SELECT 1 FROM appointments 
       WHERE user_id = ?
       AND ((? BETWEEN starts_at AND ends_at) OR (? BETWEEN starts_at AND ends_at))`,
      [req.user.id, starts.toISOString(), ends.toISOString()]
    );
    if (overlap) return res.status(409).json({ error: 'Time overlaps existing appointment' });

    const result = await db.run(
      'INSERT INTO appointments (user_id, service_id, starts_at, ends_at, status) VALUES (?,?,?,?,?)',
      [req.user.id, data.service_id, starts.toISOString(), ends.toISOString(), 'booked']
    );

    res.status(201).json({ id: result.lastID, user_id: req.user.id, service_id: data.service_id, starts_at: starts, ends_at: ends, status: 'booked' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
