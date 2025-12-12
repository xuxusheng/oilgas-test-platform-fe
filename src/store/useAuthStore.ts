import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserInfo } from '../features/auth/types'

interface AuthState {
  token: string | null
  userInfo: UserInfo | null
  setToken: (token: string | null) => void
  setUserInfo: (userInfo: UserInfo | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userInfo: null,
      setToken: (token) => set({ token }),
      setUserInfo: (userInfo) => set({ userInfo }),
      logout: () => set({ token: null, userInfo: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, userInfo: state.userInfo }),
    },
  ),
)
