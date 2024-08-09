'use client'
import { GameStateType } from '@/types'
import { createContext } from 'react'

type GameStateContextType = {
  setgameState: (GameStateType: GameStateType) => void
}
// @ts-ignore
const GameStateContext = createContext<GameStateContextType>()
export default GameStateContext
