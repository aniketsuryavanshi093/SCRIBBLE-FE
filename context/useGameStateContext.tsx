'use client'
import { useContext } from 'react'
import GameStateContext from './GameStateContext'

function useGameStateContext() {
  return useContext(GameStateContext)
}

export default useGameStateContext
