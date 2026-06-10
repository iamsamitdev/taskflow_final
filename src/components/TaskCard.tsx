import { memo } from 'react'
import { Link } from 'react-router'
import { Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Task, TaskPriority } from '@/types/task'
import { priorityLabel, statusLabel } from '@/types/task'

interface TaskCardProps {
  task: Task
  onToggle: (task: Task) => void
  onDelete: (id: string) => void
}

// เลือก variant ของ Badge ตามระดับความสำคัญ
const priorityVariant: Record<TaskPriority, 'secondary' | 'default' | 'destructive'> = {
  low: 'secondary',
  medium: 'default',
  high: 'destructive',
}

function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const isDone = task.status === 'done'

  return (
    <Card className={isDone ? 'opacity-60' : ''}>
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-2">
          {/* คลิกชื่องานเพื่อไปหน้า Detail (Dynamic Route) */}
          <Link
            to={`/tasks/${task.id}`}
            className={`hover:text-primary hover:underline ${isDone ? 'line-through' : ''}`}
          >
            {task.title}
          </Link>
          <Badge variant={priorityVariant[task.priority]}>
            {priorityLabel[task.priority]}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {task.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {task.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <Badge variant="outline">{statusLabel[task.status]}</Badge>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onToggle(task)}>
              {isDone ? 'ทำใหม่' : 'เสร็จแล้ว'}
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(task.id)}>
              <Trash2 />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// memo — re-render เฉพาะเมื่อ props เปลี่ยนจริง (วันที่ 5: Performance)
export default memo(TaskCard)
