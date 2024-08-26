'use client'

import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'

import type { Notification } from '@/types'
import { useMembersStore } from '@/stores/membersStore'
import { socket } from '@/lib/socket'
// import { ScrollArea } from '@/components/ui/ScrollArea'
import AvatarSelector from './Avatar/AvatarSelector'
import { useGameStore } from '@/stores/gameStore'

export default function MemberList() {
  const [members, setMembers] = useMembersStore(state => [
    state.members,
    state.setMembers,
  ])
  const { gameState } = useGameStore(state => state)
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
  let membersscore = useMemo(() => {
    return members
      .map(member => {
        return {
          ...member,
          score: gameState?.score[member.id]?.score || 0,
        }
      })
      ?.sort((a, b) => b.score - a.score)
  }, [members, gameState?.score])
  return (
    <div className='h-full select-none bg-slate-100 p-3'>
      <h2 className='pb-2.5 font-medium text-black'>Members</h2>
      <div className='h-full w-full rounded-md'>
        <div className='flex flex-col gap-1 rounded-md'>
          {membersscore.map(({ id, username, Avatar }) => (
            <div
              key={id}
              className={`${
                gameState?.gameState === 'guessing-word' &&
                gameState?.guessedWordUserState &&
                gameState?.guessedWordUserState![id]?.isGuessed! &&
                'bg-green-500'
              } relative flex h-16 w-full items-center justify-start gap-2`}
            >
              <div className='memberavatar absolute bottom-[-31%] left-[-10%]'>
                <AvatarSelector
                  avatarclassname='listavatar'
                  config={Avatar}
                  isEditor={false}
                />
              </div>
              <div className='flex w-full flex-col items-center justify-between text-black'>
                <p key={id} className='text-sm'>
                  {username}
                </p>
                <p className='text-sm font-thin'>
                  Score: {gameState?.score[id] ? gameState?.score[id]?.score : 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
