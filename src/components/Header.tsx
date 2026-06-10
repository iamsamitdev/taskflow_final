import { useNavigate } from 'react-router'
import { Moon, Sun, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuthStore } from '@/features/auth/useAuthStore'
import Clock from '@/components/Clock'

function Header() {
  // ไม่มี prop drilling — ดึงจาก Context และ Store ตรง ๆ
  const { theme, toggleTheme } = useTheme()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between border-b bg-background px-6 py-3">
      <div>
        <h1 className="text-lg font-bold">📋 TaskFlow</h1>
        <p className="text-xs text-muted-foreground">ระบบจัดการงานของทีม</p>
      </div>
      <div className="flex items-center gap-3">
        <Clock />
        {user && (
          <span className="hidden text-sm text-muted-foreground md:inline">
            สวัสดี, {user.name}
          </span>
        )}
        <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="สลับธีม">
          {theme === 'light' ? <Moon /> : <Sun />}
        </Button>
        {user && (
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut /> ออกจากระบบ
          </Button>
        )}
      </div>
    </header>
  )
}

export default Header
