import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router'
import MainLayout from '@/app/MainLayout'
import ProtectedRoute from '@/app/ProtectedRoute'
import TasksPage from '@/pages/TasksPage'
import TaskDetailPage from '@/pages/TaskDetailPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import NotFoundPage from '@/pages/NotFoundPage'
import { Skeleton } from '@/components/ui/skeleton'

// Code Splitting — หน้า Dashboard ถูกแยก bundle โหลดเมื่อเข้าหน้าจริง (วันที่ 5)
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))

const PageLoader = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-40 w-full" />
  </div>
)

export const router = createBrowserRouter([
  {
    // Layout Route — ทุก children ถูกครอบด้วย MainLayout
    element: <MainLayout />,
    children: [
      {
        // Protected — ต้อง login ก่อนเท่านั้น
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          { path: 'tasks', element: <TasksPage /> },
          { path: 'tasks/:id', element: <TaskDetailPage /> },   // Dynamic param
        ],
      },
    ],
  },
  { path: 'login', element: <LoginPage /> },
  { path: 'register', element: <RegisterPage /> },
  { path: '*', element: <NotFoundPage /> },   // 404 — จับทุก path ที่เหลือ
])
