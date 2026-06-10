import { z } from 'zod'

// ฝั่ง server ต้องตรวจ input ซ้ำทุกครั้ง — client ถูก bypass ได้เสมอ
export const registerSchema = z.object({
  name: z.string().min(2, 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร'),
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string().min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'),
})

export const loginSchema = z.object({
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string().min(1, 'กรุณากรอกรหัสผ่าน'),
})

export const createTaskSchema = z.object({
  title: z.string().min(1, 'กรุณากรอกชื่องาน'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().datetime().optional(),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  status: z.enum(['todo', 'doing', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().datetime().nullable().optional(),
})
