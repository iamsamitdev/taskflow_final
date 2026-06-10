import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // ใช้ Custom Hook จากวันที่ 3 — จำธีมไว้ใน localStorage
  const [theme, setTheme] = useLocalStorage<Theme>('taskflow:theme', 'light')

  useEffect(() => {
    // เพิ่ม/ลบ class 'dark' ที่ <html> ตามมาตรฐาน shadcn + Tailwind
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom Hook ห่อ useContext — type ปลอดภัย
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme ต้องใช้ภายใต้ <ThemeProvider> เท่านั้น')
  return ctx
}
