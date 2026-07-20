import { create } from 'zustand'
import type { LeaderboardEntry } from '@/types'

interface LeaderboardState {
  leaderboard: LeaderboardEntry[]
  setLeaderboard: (data: LeaderboardEntry[]) => void
}

export const useLeaderboardStore = create<LeaderboardState>(set => ({
  leaderboard: [],
  setLeaderboard: leaderboard => set({ leaderboard }),
}))
