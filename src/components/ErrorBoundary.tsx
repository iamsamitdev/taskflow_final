import { Component, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props { children: ReactNode }
interface State { hasError: boolean }

// Error Boundary ยังต้องเป็น Class Component (กรณีเดียวที่ใช้ Class ในโปรเจกต์นี้)
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <p className="text-lg">เกิดข้อผิดพลาดบางอย่าง 😵</p>
          <Button onClick={() => window.location.reload()}>โหลดหน้าใหม่</Button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
