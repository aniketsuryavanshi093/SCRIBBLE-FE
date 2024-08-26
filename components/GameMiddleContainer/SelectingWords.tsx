import { GameStateType } from '@/types'
import { useAnimation, motion } from 'framer-motion'
import React, { useEffect, useMemo, useState } from 'react'
import AvatarSelector from '../Avatar/AvatarSelector'
import { useMembersStore } from '@/stores/membersStore'
import { socket } from '@/lib/socket'
import { useParams } from 'next/navigation'
import { User } from '@/stores/userStore'
import { useGameStore } from '@/stores/gameStore'
import { generate } from 'random-words'
import { log } from 'console'
const SelectingWords = ({
  gameState,
  setSelecting,
  selecting,
  user,
}: {
  user: User
  gameState: GameStateType
  setSelecting: React.Dispatch<React.SetStateAction<boolean>>
  selecting: boolean
}) => {
  const { roomId } = useParams()
  const [SelectedWord, setSelectedWord] = useState('')
  const { setTImerstart, setPointsTable } = useGameStore(state => state)

  const controls = useAnimation()
  const setControls = async () => {
    await controls.start({
      y: '-100%',
      display: 'none',
      transition: { duration: 0.5 },
    })
  }
  useEffect(() => {
    if (SelectedWord && gameState?.gameState === 'choosing-word') {
      socket.emit('selectword', { roomId, word: SelectedWord, id: socket.id })
      setSelectedWord('')
      setSelecting(false)
      setPointsTable(false)
    }
  }, [SelectedWord, gameState])

  useEffect(() => {
    if (gameState?.gameState === 'choosing-word') {
      const sequence = async () => {
        setSelecting(true)
        await controls.start({
          y: 'calc(100vh - 480px)',
          transition: { duration: 0.5 },
          display: 'block',
        })
        // await new Promise(resolve => setTimeout(resolve, 10000))
        // setSelecting(false)
        // setControls()
      }
      sequence()
    } else {
      setSelecting(false)
    }
  }, [gameState])

  useEffect(() => {
    socket.on('wordselected', (word: string) => {
      setSelectedWord('')
      setTImerstart(true)
    })
    return () => {
      socket.off('wordselected')
    }
  }, [socket])
  // @ts-ignore
  const words = useMemo<string[]>(() => {
    const fourto5 = generate({ minLength: 4, maxLength: 5 })
    const threeto4 = generate({ minLength: 3, maxLength: 4 })
    const fiveto6 = generate({ minLength: 5, maxLength: 6 })
    return [fourto5, threeto4, fiveto6]
  }, [selecting])
  console.log(words)
  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={controls}
      className='absolute left-0 right-0 top-0 z-50 flex items-center justify-between gap-5 p-4 text-center text-white'
    >
      {gameState && selecting ? (
        gameState?.drawer === user?.id ? (
          <div className='m-auto flex w-[50%] items-center justify-between'>
            {words?.map(elem => (
              <div
                key={elem}
                onClick={() => setSelectedWord(elem)}
                className='wordselect px-3 py-[6px] text-orange-700'
              >
                {elem}
              </div>
            ))}
          </div>
        ) : (
          <SelectingUserPara gameState={gameState} />
        )
      ) : null}
    </motion.div>
  )
}

export default SelectingWords
const SelectingUserPara = ({ gameState }: { gameState: GameStateType | undefined }) => {
  const [members] = useMembersStore(state => [state.members])
  const user = members.find(member => member.id === gameState?.drawer)
  return (
    <div className='gird relative flex h-16 w-full place-content-center gap-2'>
      <div className='memberavatar absolute bottom-[-31%] left-0 right-[50%]'>
        <AvatarSelector
          avatarclassname='listavatar'
          config={user?.Avatar}
          isEditor={false}
        />
      </div>
      <p className='grid place-content-center text-xl text-black'>
        {user?.username} is choosing a word
      </p>
    </div>
  )
}
