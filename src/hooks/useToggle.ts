import { useState, useCallback } from 'react'

// Custom Hook สลับค่า boolean
export function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = useCallback(() => setOn((prev) => !prev), [])
  return [on, toggle] as const
}
