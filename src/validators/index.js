import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const serviceSchema = z.object({
  name: z.string().min(1),
  duration_min: z.number().int().min(1),
  price: z.number().int().min(0),
});

export const appointmentSchema = z.object({
  user_id: z.number().int().positive(),
  service_id: z.number().int().positive(),
  starts_at: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)),
});
