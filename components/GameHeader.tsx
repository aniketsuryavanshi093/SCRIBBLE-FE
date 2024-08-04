'use client'
import React from 'react'
import LeaveButton from './LeaveButton'

const GameHeader = () => {
  return (
    <div className='mb-2 flex h-[50px] w-full items-center justify-end bg-slate-100'>
      <LeaveButton />
    </div>
  )
}

export default GameHeader
