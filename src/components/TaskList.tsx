import TaskCard from '@/components/TaskCard'
import type { Task } from '@/types/task'

interface TaskListProps {
  tasks: Task[]
  onToggle: (task: Task) => void
  onDelete: (id: string) => void
}

function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  // Empty State — แสดงเมื่อไม่มีงาน
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
        🎉 ยังไม่มีงานในรายการนี้ — ลองเพิ่มงานใหม่ดูสิ
      </div>
    )
  }

  return (
    // Responsive Grid: มือถือ 1 คอลัมน์ → แท็บเล็ต 2 → จอใหญ่ 3
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        // key ใช้ id จริงเสมอ — ห้ามใช้ index
        <TaskCard key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default TaskList
