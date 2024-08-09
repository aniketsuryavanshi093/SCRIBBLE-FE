import { create } from 'zustand'
import { GameStateType } from '@/types'

interface GameState {
  gameState: GameStateType | null
  setgameState: (gamestate: GameStateType) => void
}

export const useGameStore = create<GameState>(set => ({
  gameState: null,
  setgameState: gameState => set({ gameState }),
}))
