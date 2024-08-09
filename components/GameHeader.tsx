'use client'
import React from 'react'
import LeaveButton from './LeaveButton'
import Image from 'next/image'
import { useGameStore } from '@/stores/gameStore'
import WordComponent from './WordComponent'

const GameHeader = () => {
  const { gameState } = useGameStore(state => state)
  console.log(
    'MC BC gamestate=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',
    gameState
  )

  return (
    <div className='mb-2 flex h-[50px] w-full items-center justify-between bg-slate-100'>
      <div className='relative h-10 w-10'>
        <div className='absolute right-[15px] top-[10px] z-[1] text-base font-semibold text-black'>
          3
        </div>
        <Image
          src='/clock.gif'
          alt='clock'
          className='relative z-0'
          width={40}
          height={40}
          unoptimized
        />
      </div>
      <div className='grid h-full w-auto place-content-center'>
        {gameState && gameState.gameState === 'started' ? (
          gameState?.gameState === 'started' ? (
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
