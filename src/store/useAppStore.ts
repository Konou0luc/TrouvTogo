// src/store/useAppStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AppStore {
  user: User | null
  token: string | null
  refreshToken: string | null
  unreadNotifications: number
  unreadMatches: number
  unreadMessages: number

  setAuth: (user: User, token: string, refreshToken: string) => void
  clearAuth: () => void
  setUnreadCounts: (notifs: number, matches: number, messages: number) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      user: null, token: null, refreshToken: null,
      unreadNotifications: 0, unreadMatches: 0, unreadMessages: 0,

      setAuth: (user, token, refreshToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token)
          localStorage.setItem('refreshToken', refreshToken)
        }
        set({ user, token, refreshToken })
      },
      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
        }
        set({ user: null, token: null, refreshToken: null })
      },
      setUnreadCounts: (unreadNotifications, unreadMatches, unreadMessages) =>
        set({ unreadNotifications, unreadMatches, unreadMessages }),
    }),
    { 
      name: 'trouvtogo-store', 
      partialize: (s) => ({ user: s.user, token: s.token, refreshToken: s.refreshToken }) 
    }
  )
)
