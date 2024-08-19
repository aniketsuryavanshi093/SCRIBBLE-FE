'use client'
import React, { useRef } from 'react'
import LeaveButton from '../LeaveButton'
import { useGameStore } from '@/stores/gameStore'
import WordComponent from './WordComponent'
import GuessTimer from './GuessTimer'
import { socket } from '@/lib/socket'
import { useParams } from 'next/navigation'
import { useUserStore } from '@/stores/userStore'

const GameHeader = () => {
  const { gameState, setPointsTable } = useGameStore(state => state)
  const { user } = useUserStore(state => state)
  const { roomId } = useParams()
  const isemitref = useRef(false)

  const setIscompleted = () => {
    setPointsTable(true)
    if (gameState?.drawer === user?.id && !isemitref.current) {
      socket.emit('update-scorecard', { roomId })
      isemitref.current = true
    }
  }
  return (
    <div className='mb-2 flex h-[50px] w-full items-center justify-between bg-slate-100'>
      <div className='relative h-10 w-10'>
        {gameState?.gameState === 'guessing-word' && (
          <GuessTimer setIscompleted={setIscompleted} gamestate={gameState} />
        )}
      </div>
      <div className='grid h-full w-auto place-content-center'>
        {gameState && gameState.gameState === 'guessing-word' ? (
          gameState?.gameState === 'guessing-word' ? (
            <WordComponent word={gameState?.word} />
          ) : null
        ) : (
          <p className='text-lg font-semibold text-orange-500'>
            Game will start after 3 players join...
          </p>
        )}
      </div>
      <LeaveButton />
    </div>
  )
}

export default GameHeader
