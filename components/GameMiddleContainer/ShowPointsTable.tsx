/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { GameStateType } from '@/types'
import { useAnimation, motion } from 'framer-motion'
import { useMembersStore } from '@/stores/membersStore'
import { socket } from '@/lib/socket'
import { useParams } from 'next/navigation'

const ShowPointsTable: FC<{ gameState: GameStateType }> = ({ gameState }) => {
  const controls = useAnimation()
  const { showPointsTable, setPointsTable, setTImerstart } = useGameStore(state => state)
  const { members } = useMembersStore(state => state)
  const { roomId } = useParams()
  const setControls = async () => {
    await controls.start({
      y: '-100%',
      display: 'none',
      transition: { duration: 0.5 },
    })
  }
  useEffect(() => {
    if (showPointsTable) {
      const sequence = async () => {
        await controls.start({
          y: 'calc(100vh - 480px)',
          transition: { duration: 0.5 },
          display: 'block',
        })
        await new Promise(resolve => setTimeout(resolve, 10000))
        setControls()
        socket.emit('change-drawer', { roomId })
        setPointsTable(false)
        setTImerstart(false)
      }
      sequence()
    } else {
      setControls()
    }
  }, [controls, gameState, setControls, showPointsTable, socket])
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
                  {' '}
                  {members?.find(el => el.id === elem)?.username}{' '}
                </p>
                <p className='text-lg font-extrabold'>
                  {' '}
                  {gameState?.score[elem]?.score}{' '}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default ShowPointsTable
