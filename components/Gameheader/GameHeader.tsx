'use client'
import React, { useEffect } from 'react'
import LeaveButton from '../LeaveButton'
import { useGameStore } from '@/stores/gameStore'
import WordComponent from './WordComponent'
import GuessTimer from './GuessTimer'

const GameHeader = () => {
  const { gameState, showPointsTable, setPointsTable } = useGameStore(state => state)
  useEffect(() => {
    if (showPointsTable) {
      setTimeout(() => {
        setPointsTable(false)
      }, 120000)
    }
  }, [showPointsTable, setPointsTable])

  const setIscompleted = () => {
    setPointsTable(true)
    console.log('completed')
  }
  return (
    <div className='mb-2 flex h-[50px] w-full items-center justify-between bg-slate-100'>
      <div className='relative h-10 w-10'>
        {gameState?.gameState === 'guessing-word' && (
          <GuessTimer setIscompleted={setIscompleted} gamestate={gameState!} />
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
