import { useMemo } from 'react'
import { Link } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import StatCard from '@/components/StatCard'
import { useTaskStats, useTasks } from '@/features/tasks/queries'
import { statusLabel, priorityLabel } from '@/types/task'

function DashboardPage() {
  const { data: stats, isPending: statsLoading } = useTaskStats()
  const { data: tasksPage } = useTasks({ page: 1 })

  // useMemo — คำนวณงานที่ยังไม่เสร็จเฉพาะเมื่อข้อมูลเปลี่ยน
  const pendingTasks = useMemo(
    () => (tasksPage?.items ?? []).filter((t) => t.status !== 'done').slice(0, 5),
    [tasksPage]
  )

  if (statsLoading || !stats) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    )
  }

  const progress = [
    { key: 'done', count: stats.done, color: 'bg-green-500' },
    { key: 'doing', count: stats.doing, color: 'bg-blue-500' },
    { key: 'todo', count: stats.todo, color: 'bg-muted-foreground' },
  ] as const

  return (
    <div className="space-y-6">
      {/* StatCard ใช้ children (Composition จากวันที่ 2) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="งานทั้งหมด">{stats.total}</StatCard>
        <StatCard label="กำลังทำ">
          <span className="text-blue-500">{stats.doing}</span>
        </StatCard>
        <StatCard label="เสร็จแล้ว">
          <span className="text-green-500">{stats.done}</span>
        </StatCard>
        <StatCard label="เลยกำหนด">
          <span className="text-destructive">{stats.overdue}</span>
        </StatCard>
      </div>

      {/* ความคืบหน้า */}
      <Card>
        <CardHeader>
          <CardTitle>ความคืบหน้าของทีม</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {progress.map(({ key, count, color }) => {
            const pct = stats.total ? Math.round((count / stats.total) * 100) : 0
            return (
              <div key={key}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{statusLabel[key]}</span>
                  <span className="text-muted-foreground">
                    {count} งาน ({pct}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className={`h-2 rounded-full transition-all ${color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* งานที่ยังไม่เสร็จล่าสุด */}
      <Card>
        <CardHeader>
          <CardTitle>งานที่ต้องทำ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {pendingTasks.length === 0 && (
            <p className="text-sm text-muted-foreground">
              ไม่มีงานค้าง เยี่ยมมาก! 🎉
            </p>
          )}
          {pendingTasks.map((task) => (
            <Link
              key={task.id}
              to={`/tasks/${task.id}`}
              className="flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-colors hover:border-primary"
            >
              <span>{task.title}</span>
              <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                {priorityLabel[task.priority]}
              </Badge>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage
