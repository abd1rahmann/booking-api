import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db.js';
import { loginSchema, registerSchema } from '../validators/index.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const db = await getDb();
    const hash = await bcrypt.hash(data.password, 10);
    const result = await db.run(
      'INSERT INTO users (email, password_hash, name, role) VALUES (?,?,?,?)',
      [data.email, hash, data.name, 'customer']
    );
    return res.status(201).json({ id: result.lastID, email: data.email, name: data.name });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [data.email]);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(data.password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

export default router;
