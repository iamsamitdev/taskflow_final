import { z } from 'zod'

// Schema = แหล่งความจริงหนึ่งเดียวของกติกาฟอร์ม
export const loginSchema = z.object({
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string().min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'),
})

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(2, 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านทั้งสองช่องไม่ตรงกัน',
    path: ['confirmPassword'],
  })

// schema สำหรับฟอร์มเพิ่ม/แก้ไขงาน
export const taskSchema = z.object({
  title: z.string().min(1, 'กรุณากรอกชื่องาน'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
})

// สร้าง type จาก schema อัตโนมัติ — ไม่ต้องประกาศซ้ำ
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type TaskInput = z.infer<typeof taskSchema>
