import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation, Link } from 'react-router'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { loginSchema, type LoginInput } from '@/features/auth/schemas'
import { useAuthStore } from '@/features/auth/useAuthStore'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),   // เชื่อม Zod เข้ากับ RHF
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: LoginInput) => {
    try {
      await login(values.email, values.password)
      toast.success('เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ! 🎉')
      // เด้งกลับหน้าที่ผู้ใช้ตั้งใจจะเข้าก่อนถูกส่งมา login
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname
      navigate(from ?? '/', { replace: true })
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.error
          ? String(error.response.data.error)
          : 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่'
      toast.error(message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-2xl">
            📋
          </div>
          <CardTitle>เข้าสู่ระบบ TaskFlow</CardTitle>
          <CardDescription>ระบบจัดการงานของทีม</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>อีเมล</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />   {/* ข้อความ error จาก Zod ขึ้นตรงนี้ */}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รหัสผ่าน</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            ยังไม่มีบัญชี?{' '}
            <Link to="/register" className="text-primary underline">
              สมัครสมาชิก
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
