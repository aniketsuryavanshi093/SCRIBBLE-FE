import { FC, useEffect, useMemo, useRef } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { GameStateType } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { useMembersStore } from '@/stores/membersStore'
import { useLeaderboardStore } from '@/stores/leaderboardStore'
import { socket } from '@/lib/socket'
import { useParams } from 'next/navigation'
import { useUserStore } from '@/stores/userStore'
import AvatarSelector from '../Avatar/AvatarSelector'
import Image from 'next/image'

const MEDAL = ['🥈', '🥇', '🥉']
const PODIUM_HEIGHT = ['h-16', 'h-24', 'h-10']
const PODIUM_LABEL = ['2nd', '1st', '3rd']

const ShowPointsTable: FC<{ gameState: GameStateType }> = ({ gameState }) => {
  const { showPointsTable, setPointsTable } = useGameStore(state => state)
  const { user } = useUserStore(state => state)
  const { members } = useMembersStore(state => state)
  const { leaderboard } = useLeaderboardStore(state => state)
  const { roomId } = useParams()

  const latestGameStateRef = useRef(gameState)
  const isemitref = useRef(false)
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    latestGameStateRef.current = gameState
  }, [gameState])

  useEffect(() => {
    if (!showPointsTable) return

    const gs = latestGameStateRef.current?.gameState

    if (gs === 'guessing-word') {
      // Drawer triggers the round change; everyone auto-dismisses after 10 s
      if (
        latestGameStateRef.current?.drawer === user?.id &&
        !isemitref.current
      ) {
        dismissTimerRef.current = setTimeout(() => {
          socket.emit('drawerchoosingword', { roomId, type: 'change' })
          socket.emit('set-words-indicator', { roomId, exposedWords: [] })
        }, 10000)
      }
      isemitref.current = true

      // All clients dismiss the overlay after 10 s
      dismissTimerRef.current = setTimeout(() => {
        setPointsTable(false)
        isemitref.current = false
      }, 10000)
    }
    // 'finished' state stays visible — no auto-dismiss

    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
    }
  }, [showPointsTable])

  // Top 3 from server-ranked leaderboard, enriched with member data for display
  const winners = useMemo(() => {
    const top3 = leaderboard.slice(0, 3).map(entry => {
      const member = members.find(m => m.id === entry.userId)
      return {
        id: entry.userId,
        username: member?.username ?? entry.userId,
        Avatar: member?.Avatar,
        score: entry.score,
      }
    })
    // Arrange as [2nd, 1st, 3rd] for the podium display
    return [top3[1], top3[0], top3[2]]
  }, [leaderboard, members])

  return (
    <AnimatePresence>
      {showPointsTable && (
        <motion.div
          key='points-overlay'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: 'none' }}
          transition={{ duration: 0.25 }}
          className='absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto'
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='w-[90%] max-w-[460px] rounded-2xl bg-gray-900 p-6 shadow-2xl ring-1 ring-white/10'
          >
            {gameState?.gameState === 'finished' ? (
              /* ── GAME FINISHED PODIUM ── */
              <div className='flex flex-col items-center gap-5'>
                {/* Title */}
                <div className='flex items-center gap-2'>
                  <Image src='/racing-flag.png' alt='finish' width={26} height={26} />
                  <h2 className='text-2xl font-extrabold tracking-tight text-white'>
                    Game Finished!
                  </h2>
                  <Image src='/racing-flag.png' alt='finish' width={26} height={26} />
                </div>

                {/* Podium */}
                <div className='flex items-end justify-center gap-6'>
                  {winners.map((winner, index) =>
                    winner ? (
                      <div key={winner.id} className='flex flex-col items-center gap-1'>
                        <span className='text-2xl'>{MEDAL[index]}</span>
                        <div className='relative'>
                          <AvatarSelector
                            avatarclassname='pointsavatar'
                            config={winner.Avatar}
                            isEditor={false}
                          />
                          {index === 1 && (
                            <span className='absolute -top-3 left-1/2 -translate-x-1/2 text-lg'>
                              👑
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm font-extrabold ${
                            index === 1 ? 'text-yellow-300 text-base' : 'text-white'
                          }`}
                        >
                          {winner.username}
                        </p>
                        <p className='text-xs font-bold text-emerald-400'>
                          {winner.score} pts
                        </p>
                        <div
                          className={`${PODIUM_HEIGHT[index]} w-16 rounded-t-lg flex items-center justify-center ${
                            index === 1
                              ? 'bg-yellow-500'
                              : index === 0
                              ? 'bg-slate-400'
                              : 'bg-amber-700'
                          }`}
                        >
                          <span className='text-xs font-bold text-white'>
                            {PODIUM_LABEL[index]}
                          </span>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>

                {/* Full scoreboard (4th place and beyond) */}
                {leaderboard.length > 3 && (
                  <div className='w-full rounded-xl bg-white/5 px-4 py-3'>
                    <p className='mb-2 text-center text-[10px] font-semibold uppercase tracking-widest text-white/40'>
                      All Players
                    </p>
                    <div className='flex flex-col gap-1'>
                      {leaderboard.map((entry, i) => {
                        const member = members.find(m => m.id === entry.userId)
                        return (
                          <div
                            key={entry.userId}
                            className='flex items-center justify-between rounded-lg px-3 py-1 text-sm odd:bg-white/5'
                          >
                            <span className='font-medium text-white/80'>
                              #{i + 1} {member?.username ?? entry.userId}
                            </span>
                            <span className='font-bold text-emerald-400'>{entry.score} pts</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── ROUND END SUMMARY ── */
              <div className='flex flex-col items-center gap-4'>
                {/* Header */}
                <div className='flex flex-col items-center gap-1'>
                  <p className='text-xl font-extrabold text-white'>⏰ Time&apos;s up!</p>
                  <p className='text-sm text-white/60'>
                    The word was{' '}
                    <span className='rounded-md bg-yellow-500/20 px-2 py-0.5 font-bold text-yellow-300 ring-1 ring-yellow-400/40'>
                      {gameState?.word}
                    </span>
                  </p>
                </div>

                {/* Scoreboard */}
                <div className='w-full rounded-xl bg-white/5 px-4 py-3'>
                  <p className='mb-2 text-center text-[10px] font-semibold uppercase tracking-widest text-white/40'>
                    Scores
                  </p>
                  <div className='flex flex-col gap-1'>
                    {leaderboard.map((entry, i) => {
                      const member = members.find(m => m.id === entry.userId)
                      const isMe = entry.userId === user?.id
                      return (
                        <div
                          key={entry.userId}
                          className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                            isMe
                              ? 'bg-yellow-500/15 ring-1 ring-yellow-400/40'
                              : 'odd:bg-white/5'
                          }`}
                        >
                          <span className='flex items-center gap-2 font-medium text-white'>
                            <span className='w-5 text-center text-white/30 text-xs'>
                              #{i + 1}
                            </span>
                            {member?.username ?? entry.userId}
                            {isMe && (
                              <span className='rounded bg-yellow-500/30 px-1.5 py-0.5 text-[10px] font-bold text-yellow-300'>
                                you
                              </span>
                            )}
                          </span>
                          <span className='font-bold text-emerald-400'>{entry.score} pts</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <p className='text-[11px] text-white/30'>Next round starting in 10 s…</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ShowPointsTable
