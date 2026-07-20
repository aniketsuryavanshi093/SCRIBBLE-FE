'use client'
import React, { FC, ReactNode, useEffect } from 'react'
import GameStateContext from './GameStateContext'
import { socket } from '@/lib/socket'
import { GameStateType, LeaderboardEntry } from '@/types'
import { useGameStore } from '@/stores/gameStore'
import { useLeaderboardStore } from '@/stores/leaderboardStore'
import { useParams } from 'next/navigation'

const GameStateManager: FC<{ children: ReactNode }> = ({ children }) => {
  const { setgameState, setPointsTable } = useGameStore(state => state)
  const { setLeaderboard } = useLeaderboardStore(state => state)
  const { roomId } = useParams()

  useEffect(() => {
    socket.on('game-started', (data: GameStateType) => {
      console.log('data', data)
      setgameState(data)
      if (data?.gameState === 'finished') {
        setPointsTable(true)
        socket.emit('get-leaderboard', roomId)
      }
      socket.emit('drawerchoosingword', { roomId, id: data?.drawer })
    })

    socket.on('recievegamestate', (data: GameStateType) => {
      console.log('recievegamestate', data)
      setgameState(data)
      if (data?.gameState === 'finished') {
        setPointsTable(true)
        socket.emit('get-leaderboard', roomId)
      }
    })

    socket.on('leaderboard-from-server', (data: LeaderboardEntry[]) => {
      setLeaderboard(data)
    })

    return () => {
      socket.off('game-started')
      socket.off('recievegamestate')
      socket.off('leaderboard-from-server')
    }
  }, [])

  return (
    <GameStateContext.Provider value={{ setgameState }}>
      {children}
    </GameStateContext.Provider>
  )
}

export default GameStateManager
