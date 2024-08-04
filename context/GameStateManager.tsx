'use client'
import React, { FC, ReactNode, useEffect, useState } from 'react'
import GameStateContext from './GameStateContext'
import { socket } from '@/lib/socket'
import { GameStateType } from '@/types'

const GameStateManager: FC<{ children: ReactNode }> = ({ children }) => {
  const [GameStarted, setGameStarted] = useState(false)
  const [GameState, setGameState] = useState<GameStateType | null>(null)

  useEffect(() => {
    socket.on('game-started', data => {
      console.log('data', data)
      setGameStarted(true)
      setGameState(data)
    })
    socket.on('recievegamestate', data => {
      console.log('recievegamestate', data)
      setGameState(data)
    })
  }, [socket])
  return (
    <GameStateContext.Provider
      value={{
        GameStarted,
        GameState,
      }}
    >
      {children}
    </GameStateContext.Provider>
  )
}

export default GameStateManager
