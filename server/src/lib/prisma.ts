import { PrismaClient } from '@prisma/client'

// สร้าง Prisma Client ตัวเดียวใช้ทั้งแอป
export const prisma = new PrismaClient()
