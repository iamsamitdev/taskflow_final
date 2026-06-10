import { useState, useEffect } from 'react'

function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    // Side Effect: ตั้ง interval อัปเดตเวลาทุกวินาที
    const timer = setInterval(() => setNow(new Date()), 1000)
    // Cleanup: เคลียร์ interval เมื่อ component ถูกถอด — กัน memory leak
    return () => clearInterval(timer)
  }, [])

  return (
    <span className="hidden text-sm tabular-nums text-muted-foreground sm:inline">
      {now.toLocaleTimeString('th-TH')}
    </span>
  )
}

export default Clock
