import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import TaskList from '@/components/TaskList'
import AddTaskForm from '@/components/AddTaskForm'
import { useTasks, useUpdateTask, useDeleteTask } from '@/features/tasks/queries'
import type { Task, TaskStatus } from '@/types/task'

function TasksPage() {
  // Filter + page อยู่ใน URL — กด back ได้ refresh ไม่หาย แชร์ลิงก์ได้ (วันที่ 4)
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = (searchParams.get('status') ?? 'all') as TaskStatus | 'all'
  const page = Number(searchParams.get('page') ?? 1)
  const [search, setSearch] = useState('')

  const { data, isPending, isError, isFetching } = useTasks({ page, status: filter, search })
  const updateMutation = useUpdateTask()
  const deleteMutation = useDeleteTask()

  const handleFilterChange = (value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value === 'all') next.delete('status')
    else next.set('status', value)
    next.delete('page')   // เปลี่ยน filter แล้วกลับหน้า 1
    setSearchParams(next)
  }

  const goToPage = (p: number) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
  }

  const handleToggle = (task: Task) => {
    updateMutation.mutate({
      id: task.id,
      status: task.status === 'done' ? 'todo' : 'done',
    })
  }

  return (
    <div className="space-y-6">
      <AddTaskForm />

      {/* Tabs กรองสถานะ + ช่องค้นหา */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={handleFilterChange}>
          <TabsList>
            <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
            <TabsTrigger value="todo">รอดำเนินการ</TabsTrigger>
            <TabsTrigger value="doing">กำลังทำ</TabsTrigger>
            <TabsTrigger value="done">เสร็จแล้ว</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="w-full pl-9 sm:w-56"
            placeholder="ค้นหางาน..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Loading State ครั้งแรก — Skeleton */}
      {isPending && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <p className="rounded-xl border border-destructive/50 p-6 text-center text-destructive">
          โหลดข้อมูลไม่สำเร็จ — ตรวจสอบว่า API Server ทำงานอยู่หรือไม่
        </p>
      )}

      {/* Success State */}
      {data && (
        <>
          <TaskList
            tasks={data.items}
            onToggle={handleToggle}
            onDelete={(id) => deleteMutation.mutate(id)}
          />

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
              >
                <ChevronLeft /> ก่อนหน้า
              </Button>
              <span className="text-sm text-muted-foreground">
                หน้า {data.page} / {data.totalPages} {isFetching && '⏳'}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => goToPage(page + 1)}
              >
                ถัดไป <ChevronRight />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TasksPage
