'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

import type { Notification } from '@/types'
import { useMembersStore } from '@/stores/membersStore'
import { socket } from '@/lib/socket'
import { ScrollArea } from '@/components/ui/ScrollArea'
import AvatarSelector from './Avatar/AvatarSelector'

export default function MemberList() {
  const [members, setMembers] = useMembersStore(state => [
    state.members,
    state.setMembers,
  ])
  console.log(members)

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

  return (
    <div className='h-full select-none bg-muted p-3'>
      <h2 className='pb-2.5 font-medium'>Members</h2>
      <div className='h-full w-full rounded-md bg-muted p-2'>
        <div className='flex flex-col gap-1 rounded-md px-1'>
          {members.map(({ id, username, Avatar }) => (
            <div key={id} className='relative flex items-center justify-center gap-2'>
              <div className='memberavatar absolute'>
                <AvatarSelector
                  avatarclassname='listavatar'
                  config={Avatar}
                  isEditor={false}
                />
              </div>
              <p key={id}>{username}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
