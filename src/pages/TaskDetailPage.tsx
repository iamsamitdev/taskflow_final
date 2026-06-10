import { useParams, useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTask, useUpdateTask, useDeleteTask } from '@/features/tasks/queries'
import { priorityLabel, statusLabel } from '@/types/task'

function TaskDetailPage() {
  // ดึงค่า :id จาก URL เช่น /tasks/abc123 → id = 'abc123'
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: task, isPending, isError } = useTask(id ?? '')
  const updateMutation = useUpdateTask()
  const deleteMutation = useDeleteTask()

  if (isPending) return <Skeleton className="h-60 rounded-xl" />

  if (isError || !task) {
    return (
      <div className="space-y-4 text-center">
        <p>ไม่พบงานที่ต้องการ 😢</p>
        <Button onClick={() => navigate('/tasks')}>กลับหน้ารายการ</Button>
      </div>
    )
  }

  const isDone = task.status === 'done'

  const handleDelete = () => {
    deleteMutation.mutate(task.id, {
      onSuccess: () => navigate('/tasks'),
    })
  }

  return (
    <div className="space-y-4">
      <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft /> ย้อนกลับ
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-start justify-between gap-2 text-2xl">
            <span className={isDone ? 'line-through opacity-60' : ''}>{task.title}</span>
            <Badge variant={task.priority === 'high' ? 'destructive' : 'default'}>
              {priorityLabel[task.priority]}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-muted-foreground">
            {task.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-muted-foreground">สถานะ</p>
              <Badge variant="outline">{statusLabel[task.status]}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground">สร้างเมื่อ</p>
              <p className="font-medium">
                {new Date(task.createdAt).toLocaleDateString('th-TH', {
                  dateStyle: 'long',
                })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Route (useParams)</p>
              <p className="font-mono text-xs">/tasks/{task.id.slice(0, 8)}...</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() =>
                updateMutation.mutate({
                  id: task.id,
                  status: isDone ? 'todo' : 'done',
                })
              }
              disabled={updateMutation.isPending}
            >
              {isDone ? 'ทำใหม่อีกครั้ง' : 'ทำเครื่องหมายว่าเสร็จ'}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              ลบงานนี้
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TaskDetailPage
