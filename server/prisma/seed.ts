import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ข้อมูลตั้งต้นสำหรับทดสอบระบบ
async function main() {
  const password = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskflow.dev' },
    update: {},
    create: {
      name: 'แอดมิน ทีมเวิร์ค',
      email: 'admin@taskflow.dev',
      password,
      role: 'admin',
    },
  })

  const member = await prisma.user.upsert({
    where: { email: 'somchai@taskflow.dev' },
    update: {},
    create: {
      name: 'สมชาย ใจดี',
      email: 'somchai@taskflow.dev',
      password,
      role: 'member',
    },
  })

  await prisma.task.createMany({
    data: [
      { title: 'ออกแบบหน้า Dashboard', description: 'ทำ wireframe และเลือกชุดสีหลักของระบบ', status: 'doing', priority: 'high', ownerId: member.id, dueDate: new Date(Date.now() + 5 * 86400000) },
      { title: 'เขียนเอกสาร API', description: 'สรุป endpoint ทั้งหมดของ TaskFlow API', status: 'todo', priority: 'medium', ownerId: member.id, dueDate: new Date(Date.now() + 10 * 86400000) },
      { title: 'ตั้งค่า CI/CD Pipeline', description: 'GitHub Actions → Vercel auto deploy', status: 'todo', priority: 'high', ownerId: member.id, dueDate: new Date(Date.now() - 2 * 86400000) },
      { title: 'รีวิวโค้ดฟีเจอร์ Login', description: 'ตรวจ React Hook Form + Zod schema', status: 'done', priority: 'medium', ownerId: member.id },
      { title: 'ทดสอบระบบบนมือถือ', description: 'เช็ค Responsive ทุก breakpoint', status: 'doing', priority: 'low', ownerId: member.id },
      { title: 'อัปเดต Prisma Schema', description: 'เพิ่ม model Tag แบบ Many-to-Many', status: 'todo', priority: 'low', ownerId: member.id },
      { title: 'เตรียมเดโมให้ทีมบริหาร', description: 'สไลด์ + สคริปต์เดโม 10 นาที', status: 'todo', priority: 'high', ownerId: admin.id },
    ],
  })

  console.log('🌱 Seed สำเร็จ — ทดสอบด้วย somchai@taskflow.dev / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
