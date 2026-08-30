'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { socket } from '@/lib/socket'
import { useResetAllStores } from '@/hooks/useResetAllStores'

export default function LeaveButton() {
  const router = useRouter()
  const resetAll = useResetAllStores()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <button
      className='relative bottom-0 me-4 w-auto rounded-lg bg-red-700 px-4 py-2 text-white'
      onClick={() => {
        setIsLoading(true)
        socket.emit('leave-room')
        resetAll()
        setTimeout(() => {
          router.replace('/')
        }, 600)
      }}
    >
      {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Leave Room'}
    </button>
  )
}
