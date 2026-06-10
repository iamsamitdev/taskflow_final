import { api } from '@/lib/api'
import type { Task, TaskStatus } from '@/types/task'
import type { TaskInput } from '@/features/auth/schemas'

export interface TasksPage {
  items: Task[]
  total: number
  page: number
  totalPages: number
}

export interface TaskStats {
  total: number
  todo: number
  doing: number
  done: number
  overdue: number
}

export interface TasksQueryParams {
  page: number
  status?: TaskStatus | 'all'
  search?: string
}

// ดึงรายการงานแบบแบ่งหน้า + กรองสถานะ + ค้นหา
export const fetchTasks = async (params: TasksQueryParams): Promise<TasksPage> => {
  const { data } = await api.get<TasksPage>('/tasks', {
    params: {
      page: params.page,
      status: params.status === 'all' ? undefined : params.status,
      search: params.search || undefined,
    },
  })
  return data
}

export const fetchTask = async (id: string): Promise<Task> => {
  const { data } = await api.get<Task>(`/tasks/${id}`)
  return data
}

export const fetchStats = async (): Promise<TaskStats> => {
  const { data } = await api.get<TaskStats>('/tasks/stats')
  return data
}

export const createTask = async (input: TaskInput): Promise<Task> => {
  const { data } = await api.post<Task>('/tasks', input)
  return data
}

export const updateTask = async (
  input: Partial<Task> & { id: string }
): Promise<Task> => {
  const { id, ...body } = input
  const { data } = await api.patch<Task>(`/tasks/${id}`, body)
  return data
}

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`)
}
