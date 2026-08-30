import { create } from 'zustand'
import type { LeaderboardEntry } from '@/types'

interface LeaderboardState {
  leaderboard: LeaderboardEntry[]
  setLeaderboard: (data: LeaderboardEntry[]) => void
  reset: () => void
}

export const useLeaderboardStore = create<LeaderboardState>(set => ({
  leaderboard: [],
  setLeaderboard: leaderboard => set({ leaderboard }),
  reset: () => set({ leaderboard: [] }),
}))
