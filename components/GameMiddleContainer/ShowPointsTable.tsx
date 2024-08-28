import { FC, useEffect, useMemo, useRef } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { GameStateType } from '@/types'
import { useAnimation, motion } from 'framer-motion'
import { useMembersStore } from '@/stores/membersStore'
import { socket } from '@/lib/socket'
import { useParams } from 'next/navigation'
import { User, useUserStore } from '@/stores/userStore'
import AvatarSelector from '../Avatar/AvatarSelector'
import Image from 'next/image'

const ShowPointsTable: FC<{ gameState: GameStateType }> = ({ gameState }) => {
  const controls = useAnimation()
  const { showPointsTable, setPointsTable } = useGameStore(state => state)
  const { user } = useUserStore(state => state)
  const { members } = useMembersStore(state => state)
  const { roomId } = useParams()

  const latestGameStateRef = useRef(gameState)
  const isemitref = useRef(false)

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
    if (
      (showPointsTable && latestGameStateRef.current?.gameState === 'guessing-word') ||
      latestGameStateRef.current?.gameState === 'finished'
    ) {
      const sequence = async () => {
        await controls.start({
          y: 'calc(100vh - 480px)',
          transition: { duration: 0.5 },
          display: 'block',
        })
        if (
          latestGameStateRef.current?.drawer === user?.id &&
          latestGameStateRef.current?.gameState === 'guessing-word' &&
          !isemitref.current
        ) {
          setTimeout(() => {
            socket.emit('drawerchoosingword', { roomId, type: 'change' })
            socket.emit('set-words-indicator', { roomId, exposedWords: [] })
          }, 10000)
        }
        isemitref.current = true
      }
      sequence()
    } else {
      setPointsTable(false)
    }
  }, [controls, setControls, showPointsTable, socket, user])
  const winners = useMemo(() => {
    let winners: User[] = []
    const temp = members
      .map(member => {
        return {
          ...member,
          score: gameState?.score[member.id]?.score || 0,
        }
      })
      ?.sort((a, b) => b.score - a.score)
      .slice(0, 3)
    winners = [temp[1], temp[0], temp[2]]
    return winners
  }, [members, gameState?.score])
  const getImage = (rank: number) => {
    switch (rank) {
      case 1:
        return <p className='mb-3'>2nd</p>
      case 2:
        return <p className='mb-3'>1st</p>
      case 3:
        return <p className='mb-3'>3rd</p>
      default:
        break
    }
  }
  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={controls}
      className='absolute left-0 right-0 top-0 z-50 flex items-center justify-between gap-5 p-4 text-center'
    >
      {showPointsTable && (
        <div className='m-auto flex w-[50%] flex-col items-center justify-between text-black'>
          {gameState?.gameState === 'finished' ? (
            <div className=''>
              <p className='flex items-center justify-center text-xl font-semibold'>
                Game Finished{' '}
                <Image
                  className='h-[30px] w-[30px]'
                  src='/racing-flag.png'
                  alt='finish'
                  width={30}
                  height={30}
                />
              </p>
              <div className='flex items-center justify-center gap-7'>
                {winners?.map((winner, index) => (
                  <div
                    key={winner.id}
                    className={`flex flex-col items-center justify-center ${
                      index == 1 && 'mb-10'
                    }`}
                  >
                    {getImage(index + 1)}
                    <AvatarSelector
                      avatarclassname='pointsavatar'
                      config={winner.Avatar}
                      isEditor={false}
                    />
                    <p className='text-lg font-extrabold'>{winner?.username}</p>
                    <p className='text-base font-semibold text-green-800'>
                      {/* @ts-ignore */}
                      {winner?.score!}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <p className='text-xl font-semibold'>The time is up!</p>
              <p className='text-xl font-semibold'>The word was {gameState?.word}</p>
              <div className='flex flex-col items-center justify-center gap-2'>
                {Object.keys(gameState.score)?.map(elem => (
                  <div key={elem} className='flex items-center justify-center gap-2'>
                    <p className='text-lg font-extrabold'>
                      {members?.find(el => el.id === elem)?.username}
                    </p>
                    <p className='text-lg font-extrabold'>
                      {gameState?.score[elem]?.score}{' '}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default ShowPointsTable
