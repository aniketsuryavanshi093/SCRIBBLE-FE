import React, { FC } from 'react'

const WordComponent: FC<{ word: string }> = ({ word }) => {
  return <div className='text-black'>{word}</div>
}

export default WordComponent
