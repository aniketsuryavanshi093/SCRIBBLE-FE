'use client'

import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'

import type { Notification } from '@/types'
import { useMembersStore } from '@/stores/membersStore'
import { useLeaderboardStore } from '@/stores/leaderboardStore'
import { useGameStore } from '@/stores/gameStore'
import { useUserStore } from '@/stores/userStore'
import { socket } from '@/lib/socket'
// import { ScrollArea } from '@/components/ui/ScrollArea'
import AvatarSelector from './Avatar/AvatarSelector'

export default function MemberList() {
  const [members, setMembers] = useMembersStore(state => [
    state.members,
    state.setMembers,
  ])
  const { leaderboard } = useLeaderboardStore(state => state)
  const { gameState } = useGameStore(state => state)
  const { user } = useUserStore(state => state)

  useEffect(() => {
    socket.on('update-members', members => {
      setMembers(members)
    })

    socket.on('send-notification', ({ title, message }: Notification) => {
      toast(title, {
        description: message,
      })
    })

    return () => {
      socket.off('update-members')
      socket.off('send-notification')
    }
  }, [setMembers])

  // Merge members (username/avatar) with scores.
  // During an active game gameState.score is the live mirror; leaderboard store
  // is populated at round-end. Use whichever has data.
  const membersscore = useMemo(() => {
    return members
      .map(member => {
        const lbEntry = leaderboard.find(e => e.userId === member.id)
        const liveScore = gameState?.score?.[member.id]?.score ?? 0
        return {
          ...member,
          score: lbEntry?.score ?? liveScore,
        }
      })
      .sort((a, b) => b.score - a.score)
  }, [members, leaderboard, gameState?.score])
  return (
    <div className='h-full select-none bg-slate-100 p-3'>
      <h2 className='pb-2.5 font-medium text-black'>Members</h2>
      <div className='h-full w-full rounded-md'>
        <div className='flex flex-col gap-1 rounded-md'>
          {membersscore.map(({ id, username, Avatar, score }) => {
            const isCurrentUser = id === user?.id
            const hasGuessed =
              gameState?.gameState === 'guessing-word' &&
              gameState?.guessedWordUserState?.[id]?.isGuessed
            const isDrawer = gameState?.drawer === id

            return (
              <div
                key={id}
                className={`${hasGuessed ? 'bg-green-500' : ''} ${
                  isCurrentUser ? 'ring-2 ring-orange-400' : ''
                } relative flex h-16 w-full items-center justify-start gap-2 rounded`}
              >
                <div className='memberavatar absolute bottom-[-31%] left-[-10%]'>
                  <AvatarSelector
                    avatarclassname='listavatar'
                    config={Avatar}
                    isEditor={false}
                  />
                </div>
                <div className='flex w-full flex-col items-center justify-between text-black'>
                  <p className='text-sm'>
                    {username}
                    {isCurrentUser && (
                      <span className='ml-1 text-xs text-orange-500'>(you)</span>
                    )}
                    {isDrawer && gameState?.gameState === 'guessing-word' && (
                      <span className='ml-1 text-xs text-blue-500'>✏️</span>
                    )}
                  </p>
                  <p className='text-sm font-thin'>Score: {score}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
