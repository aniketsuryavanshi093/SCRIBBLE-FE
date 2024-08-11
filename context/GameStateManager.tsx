'use client'
import React, { FC, ReactNode, useEffect, useState } from 'react'
import GameStateContext from './GameStateContext'
import { socket } from '@/lib/socket'
import { GameStateType } from '@/types'
import { useGameStore } from '@/stores/gameStore'
import { useParams } from 'next/navigation'

const GameStateManager: FC<{ children: ReactNode }> = ({ children }) => {
  const { setgameState } = useGameStore(state => state)
  const { roomId } = useParams()
  useEffect(() => {
    socket.on('game-started', (data: GameStateType) => {
      console.log('data', data)
      setgameState(data)
      socket.emit('drawerchoosingword', { roomId, id: data?.drawer })
    })
    socket.on('recievegamestate', data => {
      console.log('recievegamestate', data)
      setgameState(data)
    })
  }, [socket])
  return (
    <GameStateContext.Provider
      value={{
        setgameState,
      }}
    >
      {children}
    </GameStateContext.Provider>
  )
}

export default GameStateManager
