import { Hono } from 'hono'
import { prisma } from '../lib/prisma.js'
import { authMiddleware } from '../lib/auth.js'
import { createTaskSchema, updateTaskSchema } from '../lib/schemas.js'

const tasks = new Hono<{
  Variables: { userId: string; role: 'admin' | 'member' }
}>()

// ทุก endpoint ในไฟล์นี้ต้อง login ก่อน
tasks.use('*', authMiddleware)

// GET /api/tasks/stats — สถิติสำหรับ Dashboard
tasks.get('/stats', async (c) => {
  const userId = c.get('userId')

  const [total, todo, doing, done, overdue] = await Promise.all([
    prisma.task.count({ where: { ownerId: userId } }),
    prisma.task.count({ where: { ownerId: userId, status: 'todo' } }),
    prisma.task.count({ where: { ownerId: userId, status: 'doing' } }),
    prisma.task.count({ where: { ownerId: userId, status: 'done' } }),
    prisma.task.count({
      where: {
        ownerId: userId,
        status: { not: 'done' },
        dueDate: { lt: new Date() },
      },
    }),
  ])

  return c.json({ total, todo, doing, done, overdue })
})

// GET /api/tasks?page=1&status=doing&search=คำค้น — รายการงานแบบแบ่งหน้า
tasks.get('/', async (c) => {
  const userId = c.get('userId')
  const page = Math.max(1, Number(c.req.query('page') ?? 1))
  const pageSize = 9
  const status = c.req.query('status')
  const search = c.req.query('search')

  // Authorization: ดึงเฉพาะงานของตัวเองเสมอ
  const where = {
    ownerId: userId,
    ...(status && ['todo', 'doing', 'done'].includes(status)
      ? { status: status as 'todo' | 'doing' | 'done' }
      : {}),
    ...(search
      ? { title: { contains: search, mode: 'insensitive' as const } }
      : {}),
  }

  // ดึงรายการ + จำนวนรวมพร้อมกันในรอบเดียว
  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.task.count({ where }),
  ])

  return c.json({
    items,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  })
})

// GET /api/tasks/:id — รายละเอียดงาน
tasks.get('/:id', async (c) => {
  const userId = c.get('userId')
  const task = await prisma.task.findUnique({ where: { id: c.req.param('id') } })

  if (!task) return c.json({ error: 'ไม่พบงานที่ต้องการ' }, 404)
  // เช็คสิทธิ์ฝั่ง server เสมอ — UI แค่ซ่อน ไม่ใช่ป้องกัน
  if (task.ownerId !== userId && c.get('role') !== 'admin') {
    return c.json({ error: 'ไม่มีสิทธิ์ดูงานนี้' }, 403)
  }

  return c.json(task)
})

// POST /api/tasks — สร้างงานใหม่
tasks.post('/', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const parsed = createTaskSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0].message }, 400)
  }

  const { dueDate, ...rest } = parsed.data
  const task = await prisma.task.create({
    data: {
      ...rest,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      ownerId: userId,
    },
  })

  return c.json(task, 201)
})

// PATCH /api/tasks/:id — แก้ไขงาน
tasks.patch('/:id', async (c) => {
  const userId = c.get('userId')
  const id = c.req.param('id')

  const existing = await prisma.task.findUnique({ where: { id } })
  if (!existing) return c.json({ error: 'ไม่พบงานที่ต้องการ' }, 404)
  if (existing.ownerId !== userId && c.get('role') !== 'admin') {
    return c.json({ error: 'ไม่มีสิทธิ์แก้ไขงานนี้' }, 403)
  }

  const body = await c.req.json()
  const parsed = updateTaskSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0].message }, 400)
  }

  const { dueDate, ...rest } = parsed.data
  const task = await prisma.task.update({
    where: { id },
    data: {
      ...rest,
      ...(dueDate !== undefined
        ? { dueDate: dueDate ? new Date(dueDate) : null }
        : {}),
    },
  })

  return c.json(task)
})

// DELETE /api/tasks/:id — ลบงาน
tasks.delete('/:id', async (c) => {
  const userId = c.get('userId')
  const id = c.req.param('id')

  const existing = await prisma.task.findUnique({ where: { id } })
  if (!existing) return c.json({ error: 'ไม่พบงานที่ต้องการ' }, 404)
  if (existing.ownerId !== userId && c.get('role') !== 'admin') {
    return c.json({ error: 'ไม่มีสิทธิ์ลบงานนี้' }, 403)
  }

  await prisma.task.delete({ where: { id } })
  return c.json({ ok: true })
})

export default tasks
