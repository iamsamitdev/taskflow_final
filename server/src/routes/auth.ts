import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import { createToken } from '../lib/auth.js'
import { registerSchema, loginSchema } from '../lib/schemas.js'

const auth = new Hono()

// POST /api/auth/register — สมัครสมาชิก
auth.post('/register', async (c) => {
  const body = await c.req.json()
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0].message }, 400)
  }

  const { name, email, password } = parsed.data

  // เช็คอีเมลซ้ำ
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return c.json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' }, 400)
  }

  // hash รหัสผ่านก่อนเก็บเสมอ — ห้ามเก็บ plain text
  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  })

  const token = await createToken(user.id, user.role)
  // ตัด password ออกก่อนส่งกลับ
  const { password: _omit, ...safeUser } = user
  return c.json({ user: safeUser, token }, 201)
})

// POST /api/auth/login — เข้าสู่ระบบ
auth.post('/login', async (c) => {
  const body = await c.req.json()
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0].message }, 400)
  }

  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })

  // ตอบ error แบบเดียวกันทั้งกรณีไม่พบ user และรหัสผิด — ไม่บอกใบ้คนเดารหัส
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return c.json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, 401)
  }

  const token = await createToken(user.id, user.role)
  const { password: _omit, ...safeUser } = user
  return c.json({ user: safeUser, token })
})

export default auth
