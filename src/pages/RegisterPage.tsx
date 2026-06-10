import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { registerSchema, type RegisterInput } from '@/features/auth/schemas'
import { useAuthStore } from '@/features/auth/useAuthStore'

function RegisterPage() {
  const navigate = useNavigate()
  const registerUser = useAuthStore((state) => state.register)

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (values: RegisterInput) => {
    try {
      await registerUser(values.name, values.email, values.password)
      toast.success('สมัครสมาชิกสำเร็จ ยินดีต้อนรับ! 🎉')
      navigate('/', { replace: true })
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.error
          ? String(error.response.data.error)
          : 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่'
      toast.error(message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>สมัครสมาชิก TaskFlow</CardTitle>
          <CardDescription>สร้างบัญชีใหม่ใช้เวลาไม่ถึงนาที</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อ-นามสกุล</FormLabel>
                    <FormControl>
                      <Input placeholder="สมชาย ใจดี" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>อีเมล</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />   {/* error จาก refine โผล่ช่องนี้ */}
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            มีบัญชีอยู่แล้ว?{' '}
            <Link to="/login" className="text-primary underline">
              เข้าสู่ระบบ
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage
