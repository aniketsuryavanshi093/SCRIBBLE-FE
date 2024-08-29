'use client'
import { useGameStore } from '@/stores/gameStore'
import { GameStateType } from '@/types'
import Image from 'next/image'
import React, { FC } from 'react'
import Countdown from 'react-countdown'

const GuessTimer: FC<{ gamestate: GameStateType; setIscompleted: () => void }> = ({
  gamestate,
  setIscompleted,
}) => {
  const { Timerstatr, setTImerstart } = useGameStore(state => state)

  const renderer = ({
    minutes,
    seconds,
    completed,
  }: {
    minutes: number
    seconds: number
    completed: boolean
  }) => {
    if (completed) {
      // Render a completed state
      setIscompleted()
      setTImerstart(false)
      // return null
    } else {
      // Render a countdown
      return <span>{60 * minutes + seconds}</span>
    }
  }
  return (
    <>
      <div
        id='timer'
        className='absolute right-[11px] top-[12px] z-[1] text-sm font-semibold text-black'
      >
        {Timerstatr && <Countdown date={gamestate?.lastGuesstime} renderer={renderer} />}
      </div>
      <Image
        src='/clock.gif'
        alt='clock'
        className='relative z-0'
        width={50}
        height={50}
        unoptimized
      />
    </>
  )
}

export default GuessTimer
