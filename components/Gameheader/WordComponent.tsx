import { socket } from '@/lib/socket'
import { useGameStore } from '@/stores/gameStore'
import { User } from '@/stores/userStore'
import { GameStateType } from '@/types'
import { useParams } from 'next/navigation'
import React, { FC, useEffect, useState } from 'react'

const WordComponent: FC<{ word: string; user: User; gamestate: GameStateType }> = ({
  word,
  user,
  gamestate,
}) => {
  const { Timerstatr } = useGameStore(state => state)
  const { roomId } = useParams()
  const [exposedIndex, setexposedIndex] = React.useState<number[]>([])
  function getRandomNumber(): number {
    let rand = Math.floor(Math.random() * word.length)
    return exposedIndex.includes(rand) ? getRandomNumber() : rand
  }
  const [currtime, setcurrtime] = useState(0)
  useEffect(() => {
    if (Timerstatr && user.id === gamestate?.drawer) {
      const interval = setInterval(() => {
        setcurrtime(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [Timerstatr, user, gamestate])

  useEffect(() => {
    if (currtime && user.id === gamestate?.drawer) {
      if (currtime === 60) {
        let _temp = Math.ceil(word.length * 0.2)
        for (let i = 0; i < _temp; i++) {
          let temp = [...exposedIndex, getRandomNumber()]
          setexposedIndex(temp)
          socket.emit('set-words-indicator', { roomId, exposedWords: temp })
        }
      } else if (currtime === 40) {
        let _temp = Math.ceil(word.length * 0.3)
        for (let i = 0; i < _temp; i++) {
          let temp = [...exposedIndex, getRandomNumber()]
          setexposedIndex(temp)
          socket.emit('set-words-indicator', { roomId, exposedWords: temp })
        }
      } else if (currtime === 20 && word.length > 4) {
        let _temp = Math.ceil(word.length * 0.2)
        for (let i = 0; i < _temp; i++) {
          let temp = [...exposedIndex, getRandomNumber()]
          setexposedIndex(temp)
          socket.emit('set-words-indicator', { roomId, exposedWords: temp })
        }
      }
    }
  }, [currtime, user, gamestate])

  useEffect(() => {
    socket.on('get-words-indicator', (data: number[]) => {
      setexposedIndex(data)
    })
    return () => {
      socket.off('get-words-indicator')
    }
  }, [])

  return (
    <div style={{ alignItems: 'unset' }} className='flex justify-center gap-4'>
      {word.split('').map((letter, index) => {
        return (
          <div
            key={index}
            className='grid w-[12px] place-content-end border-b-2 border-black'
          >
            <span className='text-black'>
              {exposedIndex.includes(index) ? letter : ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default React.memo(WordComponent)
