import { create } from 'zustand'
import { GameStateType } from '@/types'

interface GameState {
  gameState: GameStateType | null
  showPointsTable: boolean
  setPointsTable: (state: boolean) => void
  setgameState: (gamestate: GameStateType) => void
  Timerstatr: boolean
  setTImerstart: (state: boolean) => void
}

export const useGameStore = create<GameState>(set => ({
  gameState: null,
  Timerstatr: true,
  setTImerstart: (state: boolean) => set({ Timerstatr: state }),
  showPointsTable: false,
  setPointsTable: (state: boolean) => set({ showPointsTable: state }),
  setgameState: gameState => set({ gameState }),
}))
