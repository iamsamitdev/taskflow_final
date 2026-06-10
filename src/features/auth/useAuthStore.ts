import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { api } from '@/lib/api'
import type { User } from '@/types/user'

interface AuthResponse {
  user: User
  token: string
}

interface AuthState {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,

        // เรียก API จริง — แลก email/password เป็น JWT
        login: async (email, password) => {
          const { data } = await api.post<AuthResponse>('/auth/login', {
            email,
            password,
          })
          set({ user: data.user, token: data.token })
        },

        register: async (name, email, password) => {
          const { data } = await api.post<AuthResponse>('/auth/register', {
            name,
            email,
            password,
          })
          set({ user: data.user, token: data.token })
        },

        logout: () => set({ user: null, token: null }),
      }),
      {
        name: 'taskflow:auth',
        // เก็บเฉพาะที่จำเป็นลง localStorage
        partialize: (state) => ({ user: state.user, token: state.token }),
      }
    )
  )
)
