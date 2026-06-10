// ============================================
// ชนิดข้อมูลหลักของระบบ TaskFlow
// ============================================

export type TaskStatus = 'todo' | 'doing' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description?: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string | null
  createdAt: string
  ownerId: string
}

// ตัวช่วยแปลงค่าเป็นข้อความภาษาไทย
export const priorityLabel: Record<TaskPriority, string> = {
  low: 'ต่ำ',
  medium: 'ปานกลาง',
  high: 'สูง',
}

export const statusLabel: Record<TaskStatus, string> = {
  todo: 'รอดำเนินการ',
  doing: 'กำลังทำ',
  done: 'เสร็จแล้ว',
}
