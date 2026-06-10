import { NavLink, Outlet } from 'react-router'
import { LayoutDashboard, ListTodo } from 'lucide-react'
import Header from '@/components/Header'

// กำหนด class ตามสถานะ active ของ NavLink
const navClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
    isActive
      ? 'bg-primary text-primary-foreground'
      : 'text-muted-foreground hover:bg-muted'
  }`

function MainLayout() {
  return (
    <>
      <Header />
      <nav className="flex gap-2 border-b px-6 py-2">
        <NavLink to="/" end className={navClass}>
          <LayoutDashboard size={15} /> แดชบอร์ด
        </NavLink>
        <NavLink to="/tasks" className={navClass}>
          <ListTodo size={15} /> งานทั้งหมด
        </NavLink>
      </nav>
      <main className="mx-auto max-w-6xl p-6">
        {/* Outlet = ตำแหน่งที่หน้าลูกจะถูก render */}
        <Outlet />
      </main>
    </>
  )
}

export default MainLayout
