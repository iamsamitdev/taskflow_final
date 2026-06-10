import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-muted-foreground">ไม่พบหน้าที่คุณกำลังมองหา</p>
      <Button asChild>
        <Link to="/">กลับหน้าแรก</Link>
      </Button>
    </div>
  )
}

export default NotFoundPage
