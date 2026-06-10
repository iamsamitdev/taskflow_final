import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/features/auth/useAuthStore'

function ProtectedRoute() {
  const token = useAuthStore((state) => state.token)
  const location = useLocation()

  // ยังไม่ login → เด้งไปหน้า login พร้อมจำหน้าที่พยายามเข้า
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
