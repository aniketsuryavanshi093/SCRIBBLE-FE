'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { socket } from '@/lib/socket'
import { useResetAllStores } from '@/hooks/useResetAllStores'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'

const DisconnectedDialog = () => {
  const dialogTriggerRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const resetAll = useResetAllStores()

  useEffect(() => {
    socket.on('disconnected', () => {
      resetAll()
      dialogTriggerRef.current?.click()
    })

    return () => {
      socket.off('disconnected')
    }
  }, [])

  return (
    <Dialog>
      <DialogTrigger ref={dialogTriggerRef} className='hidden'></DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>You were disconnected!</DialogTitle>
          <DialogDescription>
            You were out of the browser for a while and lost the connection. Please create
            a new room or join a room to draw again.
          </DialogDescription>
        </DialogHeader>

        <button
          className='mt-2 w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white'
          onClick={() => router.replace('/')}
        >
          Go to Home
        </button>
      </DialogContent>
    </Dialog>
  )
}

export default DisconnectedDialog
