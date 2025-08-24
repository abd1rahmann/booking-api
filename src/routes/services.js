import { Router } from 'express';
import { getDb } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { serviceSchema } from '../validators/index.js';

const router = Router();

// List
router.get('/', async (_req, res) => {
  const db = await getDb();
  const rows = await db.all('SELECT * FROM services ORDER BY id DESC');
  res.json(rows);
});

// Create (admin only)
router.post('/', authRequired(['admin']), async (req, res) => {
  try {
    const data = serviceSchema.parse(req.body);
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO services (name, duration_min, price) VALUES (?,?,?)',
      [data.name, data.duration_min, data.price]
    );
    res.status(201).json({ id: result.lastID, ...data });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
