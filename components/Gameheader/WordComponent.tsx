import { useGameStore } from '@/stores/gameStore'
import React, { FC, useEffect, useState } from 'react'

const WordComponent: FC<{ word: string }> = ({ word }) => {
  const { Timerstatr } = useGameStore(state => state)
  const [exposedIndex, setexposedIndex] = React.useState<number[]>([])
  function getRandomNumber(): number {
    let rand = Math.floor(Math.random() * (word.length + 1))
    return exposedIndex.includes(rand) ? getRandomNumber() : rand
  }
  const [currtime, setcurrtime] = useState(0)
  useEffect(() => {
    if (Timerstatr) {
      const interval = setInterval(() => {
        setcurrtime(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [Timerstatr])

  useEffect(() => {
    if (currtime) {
      if (currtime === 60) {
        let _temp = Math.ceil(word.length * 0.2)
        for (let i = 0; i < _temp; i++) {
          setexposedIndex(prev => [...prev, getRandomNumber()])
        }
      } else if (currtime === 40) {
        let _temp = Math.ceil(word.length * 0.3)
        for (let i = 0; i < _temp; i++) {
          setexposedIndex(prev => [...prev, getRandomNumber()])
        }
      } else if (currtime === 20 && word.length > 4) {
        let _temp = Math.ceil(word.length * 0.2)
        for (let i = 0; i < _temp; i++) {
          setexposedIndex(prev => [...prev, getRandomNumber()])
        }
      }
    }
  }, [currtime])
  console.log(exposedIndex)

  return (
    <div className='flex items-center justify-center gap-4'>
      {word.split('').map((letter, index) => {
        return (
          <div
            key={index}
            className='grid w-[12px] place-content-center border-b-2 border-black'
          >
            <span className='text-black'>
              {exposedIndex.includes(index + 1) ? letter : ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default React.memo(WordComponent)
