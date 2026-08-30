import { useGameStore } from '@/stores/gameStore'
import { useMembersStore } from '@/stores/membersStore'
import { useUserStore } from '@/stores/userStore'
import { useLeaderboardStore } from '@/stores/leaderboardStore'
import { useCanvasStore } from '@/stores/canvasStore'

/**
 * Returns a single `resetAll` function that clears every store back to its
 * initial state. Call it whenever the user leaves or gets disconnected from a room.
 */
export function useResetAllStores() {
  const resetGame = useGameStore(s => s.reset)
  const resetMembers = useMembersStore(s => s.reset)
  const resetUser = useUserStore(s => s.reset)
  const resetLeaderboard = useLeaderboardStore(s => s.reset)
  const resetCanvas = useCanvasStore(s => s.reset)

  return function resetAll() {
    resetGame()
    resetMembers()
    resetUser()
    resetLeaderboard()
    resetCanvas()
  }
}
