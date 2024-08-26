import { FC, useEffect, useRef } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { GameStateType } from '@/types'
import { useAnimation, motion } from 'framer-motion'
import { useMembersStore } from '@/stores/membersStore'
import { socket } from '@/lib/socket'
import { useParams } from 'next/navigation'
import { useUserStore } from '@/stores/userStore'

const ShowPointsTable: FC<{ gameState: GameStateType }> = ({ gameState }) => {
  const controls = useAnimation()
  const { showPointsTable, setPointsTable, setTImerstart } = useGameStore(state => state)
  const { user } = useUserStore(state => state)
  const { members } = useMembersStore(state => state)
  const { roomId } = useParams()

  // Ref to store the latest gameState
  const latestGameStateRef = useRef(gameState)
  const isemitref = useRef(false)

  // Update the ref whenever gameState changes
  useEffect(() => {
    latestGameStateRef.current = gameState
  }, [gameState])

  const setControls = async () => {
    await controls.start({
      y: '-100%',
      display: 'none',
      transition: { duration: 0.5 },
    })
  }

  useEffect(() => {
    if (showPointsTable && latestGameStateRef.current?.gameState === 'guessing-word') {
      const sequence = async () => {
        await controls.start({
          y: 'calc(100vh - 480px)',
          transition: { duration: 0.5 },
          display: 'block',
        })
        // await new Promise(resolve => setTimeout(resolve, 10000))
        // Use the latest gameState from the ref
        if (
          latestGameStateRef.current?.drawer === user?.id &&
          latestGameStateRef.current?.gameState === 'guessing-word' &&
          !isemitref.current
        ) {
          setTimeout(() => {
            socket.emit('drawerchoosingword', { roomId, type: 'change' })
          }, 10000)
        }
        isemitref.current = true
        // setControls()
        // setPointsTable(false)
        // setTImerstart(false)
      }
      sequence()
    } else {
      setPointsTable(false)
      // setControls()
    }
  }, [controls, setControls, showPointsTable, socket, user])

  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={controls}
      className='absolute left-0 right-0 top-0 z-50 flex items-center justify-between gap-5 p-4 text-center'
    >
      {showPointsTable && (
        <div className='m-auto flex w-[50%] flex-col items-center justify-between text-black'>
          <p className='text-xl font-semibold'>The time is up!</p>
          <p className='text-xl font-semibold'>The word was {gameState?.word}</p>

          <div className='flex flex-col items-center justify-center gap-2'>
            {Object.keys(gameState.score)?.map(elem => (
              <div key={elem} className='flex items-center justify-center gap-2'>
                <p className='text-lg font-extrabold'>
                  {members?.find(el => el.id === elem)?.username}
                </p>
                <p className='text-lg font-extrabold'>{gameState?.score[elem]?.score} </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default ShowPointsTable
