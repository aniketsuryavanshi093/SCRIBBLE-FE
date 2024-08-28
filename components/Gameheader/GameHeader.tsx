'use client'
import React, { useRef } from 'react'
import LeaveButton from '../LeaveButton'
import { useGameStore } from '@/stores/gameStore'
import WordComponent from './WordComponent'
import GuessTimer from './GuessTimer'
import { socket } from '@/lib/socket'
import { useParams } from 'next/navigation'
import { useUserStore } from '@/stores/userStore'
import { useMembersStore } from '@/stores/membersStore'

const GameHeader = () => {
  const { gameState, setPointsTable } = useGameStore(state => state)
  const { user } = useUserStore(state => state)
  const { members } = useMembersStore(state => state)
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
      <div className='relative flex h-10 w-10 items-center'>
        {gameState?.gameState === 'guessing-word' && (
          <GuessTimer setIscompleted={setIscompleted} gamestate={gameState} />
        )}
        <p className='mx-5 whitespace-nowrap text-2xl font-bold text-black'>
          Round {gameState?.currentRound}
        </p>
        {gameState?.gameState === 'guessing-word' && (
          <p
            className={`whitespace-nowrap font-bold text-black ${
              gameState?.drawer === user?.id ? 'text-green-600' : 'text-orange-500'
            }`}
          >
            {gameState?.drawer === user?.id
              ? 'Your Turn'
              : members.find(el => el.id === gameState?.drawer)?.username +
                ' is Drawing'}{' '}
          </p>
        )}
      </div>
      <div className='grid h-full w-auto place-content-center'>
        {gameState && gameState.gameState === 'guessing-word' ? (
          gameState?.gameState === 'guessing-word' ? (
            <WordComponent word={gameState?.word} user={user!} gamestate={gameState} />
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
