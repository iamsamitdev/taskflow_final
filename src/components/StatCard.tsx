import { Card, CardContent } from '@/components/ui/card'
import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  children: ReactNode   // Composition — รับ JSX อะไรก็ได้มาแสดงข้างใน
}

function StatCard({ label, children }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="text-3xl font-bold">{children}</div>
      </CardContent>
    </Card>
  )
}

export default StatCard
