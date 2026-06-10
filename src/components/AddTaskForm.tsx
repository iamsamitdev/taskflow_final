import { useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useCreateTask } from '@/features/tasks/queries'
import type { TaskPriority } from '@/types/task'

// useFormStatus ต้องอยู่ใน component ลูกของ <form> เท่านั้น (React 19)
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      <Plus /> {pending ? 'กำลังบันทึก...' : 'เพิ่มงาน'}
    </Button>
  )
}

function AddTaskForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const createMutation = useCreateTask()

  // React 19 Form Action — รับ FormData ตรงจาก <form action={...}>
  const addTaskAction = async (formData: FormData) => {
    const title = String(formData.get('title') ?? '').trim()
    const priority = (formData.get('priority') ?? 'medium') as TaskPriority
    if (!title) return

    await createMutation.mutateAsync({ title, priority })
    formRef.current?.reset()
    inputRef.current?.focus()   // useRef — กลับมาโฟกัสช่องกรอกทันที
  }

  return (
    <form ref={formRef} action={addTaskAction} className="flex flex-col gap-2 sm:flex-row">
      <Input
        ref={inputRef}
        name="title"
        placeholder="พิมพ์ชื่องานใหม่..."
        autoComplete="off"
        className="flex-1"
      />
      <div className="flex gap-2">
        <Select name="priority" defaultValue="medium">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="ความสำคัญ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">ต่ำ</SelectItem>
            <SelectItem value="medium">ปานกลาง</SelectItem>
            <SelectItem value="high">สูง</SelectItem>
          </SelectContent>
        </Select>
        <SubmitButton />
      </div>
    </form>
  )
}

export default AddTaskForm
