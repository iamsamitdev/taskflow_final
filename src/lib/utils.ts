import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// รวม class แบบมีเงื่อนไข + แก้ class Tailwind ที่ชนกัน
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
