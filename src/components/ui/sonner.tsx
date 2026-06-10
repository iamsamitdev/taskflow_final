import { Toaster as Sonner } from 'sonner'
import { useTheme } from '@/contexts/ThemeContext'

function Toaster(props: React.ComponentProps<typeof Sonner>) {
  const { theme } = useTheme()
  return <Sonner theme={theme} richColors position="top-right" {...props} />
}

export { Toaster }
