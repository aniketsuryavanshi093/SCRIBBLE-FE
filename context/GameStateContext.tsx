'use client'
import { GameStateType } from '@/types'
import { createContext } from 'react'

type GameStateContextType = {
  GameStarted: boolean
  GameState: GameStateType | null
}
// @ts-ignore
const GameStateContext = createContext<GameStateContextType>()
export default GameStateContext
