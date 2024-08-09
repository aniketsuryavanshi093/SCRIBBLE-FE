import { GameStateType } from '@/types'
import { useAnimation, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import AvatarSelector from './Avatar/AvatarSelector'
import { useMembersStore } from '@/stores/membersStore'
import { socket } from '@/lib/socket'
import { useParams } from 'next/navigation'
import { User } from '@/stores/userStore'

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

  const controls = useAnimation()
  const setControls = async () => {
    await controls.start({
      y: '-100%',
      display: 'none',
      transition: { duration: 0.5 },
    })
    setSelecting(false)
  }
  useEffect(() => {
    if (SelectedWord && gameState?.gameState === 'choosing-word') {
      socket.emit('selectword', { roomId, word: SelectedWord, id: socket.id })
    }
  }, [SelectedWord, gameState])

  useEffect(() => {
    if (gameState?.gameState === 'choosing-word') {
      const sequence = async () => {
        setSelecting(true)
        await controls.start({ y: 'calc(100vh - 480px)', transition: { duration: 0.5 } })
        await new Promise(resolve => setTimeout(resolve, 10000))
        setControls()
      }
      sequence()
    }
  }, [gameState])

  useEffect(() => {
    socket.on('wordselected', (word: string) => {
      setControls()
    })
    return () => {
      socket.off('wordselected')
    }
  }, [socket])

  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={controls}
      className='absolute left-0 right-0 top-0 z-50 flex items-center justify-between gap-5 p-4 text-center text-white'
    >
      {gameState && selecting ? (
        gameState?.gameState === 'choosing-word' && gameState?.drawer === user?.id ? (
          <div className='m-auto flex w-[50%] items-center justify-between'>
            <div
              onClick={() => setSelectedWord('word!')}
              className='wordselect px-3 py-[6px] text-orange-700'
            >
              Word 1
            </div>
            <div className='wordselect px-3 py-[6px] text-orange-700'>Word 2</div>
            <div className='wordselect px-3 py-[6px] text-orange-700'>Word 3</div>
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
