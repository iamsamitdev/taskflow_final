import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchTasks, fetchTask, fetchStats, createTask, updateTask, deleteTask,
  type TasksQueryParams,
} from './api'

// Query Key Factory — รวม key ไว้ที่เดียว ป้องกันพิมพ์ผิด
export const taskKeys = {
  all: ['tasks'] as const,
  list: (params: TasksQueryParams) => ['tasks', 'list', params] as const,
  detail: (id: string) => ['tasks', 'detail', id] as const,
  stats: ['tasks', 'stats'] as const,
}

export function useTasks(params: TasksQueryParams) {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => fetchTasks(params),
    // คงข้อมูลหน้าเดิมไว้ระหว่างโหลดหน้าใหม่ — pagination ไม่กระพริบ
    placeholderData: (prev) => prev,
  })
}

export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => fetchTask(id),
    enabled: !!id,
  })
}

export function useTaskStats() {
  return useQuery({
    queryKey: taskKeys.stats,
    queryFn: fetchStats,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      // บอกว่าข้อมูลชุด tasks เก่าแล้ว — ให้ Query refetch เอง
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      toast.success('เพิ่มงานเรียบร้อย')
    },
    onError: () => toast.error('เพิ่มงานไม่สำเร็จ กรุณาลองใหม่'),
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
    onError: () => toast.error('บันทึกไม่สำเร็จ กรุณาลองใหม่'),
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      toast.success('ลบงานแล้ว')
    },
    onError: () => toast.error('ลบงานไม่สำเร็จ'),
  })
}
