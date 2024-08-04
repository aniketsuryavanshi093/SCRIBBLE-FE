'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

import type { Notification } from '@/types'
import { useMembersStore } from '@/stores/membersStore'
import { socket } from '@/lib/socket'
// import { ScrollArea } from '@/components/ui/ScrollArea'
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
    <div className='h-full select-none bg-slate-100 p-3'>
      <h2 className='pb-2.5 font-medium text-black'>Members</h2>
      <div className='h-full w-full rounded-md'>
        <div className='flex flex-col gap-1 rounded-md'>
          {members.map(({ id, username, Avatar }) => (
            <div
              key={id}
              className='relative flex h-16 w-full items-center justify-start gap-2'
            >
              <div className='memberavatar absolute bottom-[-31%] left-[-10%]'>
                <AvatarSelector
                  avatarclassname='listavatar'
                  config={Avatar}
                  isEditor={false}
                />
              </div>
              <p key={id} className='ms-[18%] text-sm text-black'>
                {username}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
