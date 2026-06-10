import { sign, verify } from 'hono/jwt'
import { createMiddleware } from 'hono/factory'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me'

export interface JwtPayload {
  sub: string          // user id
  role: 'admin' | 'member'
  exp: number
  [key: string]: unknown
}

// สร้าง token อายุ 7 วัน
export const createToken = (userId: string, role: 'admin' | 'member') =>
  sign(
    {
      sub: userId,
      role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    },
    JWT_SECRET
  )

// Middleware ตรวจ JWT — ผ่านแล้วฝัง userId/role ลง context
export const authMiddleware = createMiddleware<{
  Variables: { userId: string; role: 'admin' | 'member' }
}>(async (c, next) => {
  const header = c.req.header('Authorization')
  if (!header?.startsWith('Bearer ')) {
    return c.json({ error: 'กรุณาเข้าสู่ระบบก่อนใช้งาน' }, 401)
  }

  try {
    const payload = (await verify(header.slice(7), JWT_SECRET, 'HS256')) as JwtPayload
    c.set('userId', String(payload.sub))
    c.set('role', payload.role)
    await next()
  } catch {
    return c.json({ error: 'Token ไม่ถูกต้องหรือหมดอายุ' }, 401)
  }
})
