'use client'
import { GameStateType } from '@/types'
import Image from 'next/image'
import React, { FC } from 'react'
import Countdown from 'react-countdown'

const GuessTimer: FC<{ gamestate: GameStateType; setIscompleted: () => void }> = ({
  gamestate,
  setIscompleted,
}) => {
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
      return null
    } else {
      // Render a countdown
      return <span>{60 * minutes + seconds}</span>
    }
  }
  return (
    <>
      <div className='absolute right-[13px] top-[10px] z-[1] text-base font-semibold text-black'>
        <Countdown date={gamestate?.lastGuesstime} renderer={renderer} />
      </div>
      <Image
        src='/clock.gif'
        alt='clock'
        className='relative z-0'
        width={40}
        height={40}
        unoptimized
      />
    </>
  )
}

export default GuessTimer
