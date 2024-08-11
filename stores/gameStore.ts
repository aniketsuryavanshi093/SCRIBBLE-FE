import { create } from 'zustand'
import { GameStateType } from '@/types'

interface GameState {
  gameState: GameStateType | null
  showPointsTable: boolean
  setPointsTable: (state: boolean) => void
  setgameState: (gamestate: GameStateType) => void
}

export const useGameStore = create<GameState>(set => ({
  gameState: null,
  showPointsTable: false,
  setPointsTable: (state: boolean) => set({ showPointsTable: state }),
  setgameState: gameState => set({ gameState }),
}))
