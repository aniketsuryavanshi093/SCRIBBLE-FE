import { create } from 'zustand'

export interface Message {
  userid: string
  roomId: string
  message: string
  username: string
}
export interface User {
  id: string
  isAdmin: boolean
  roomId?: string
  username: string
  Avatar?: Record<
    any,
    {
      x: number
      y: number
    }
  >
}

interface UserState {
  user: User | null
  setUser: (user: User) => void
}

export const useUserStore = create<UserState>(set => ({
  user: null,
  setUser: user => set({ user: user }),
}))
