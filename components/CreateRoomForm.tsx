'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Settings2, Clock, RefreshCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'

import type { RoomJoinedData } from '@/types'
import { useUserStore } from '@/stores/userStore'
import { useMembersStore } from '@/stores/membersStore'
import { socket } from '@/lib/socket'
import { createRoomSchema } from '@/lib/validations/createRoom'
import { Button } from '@/components/ui/Button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Slider } from '@/components/ui/Slider'
import CopyButton from '@/components/CopyButton'
import AvatarSelector from './Avatar/AvatarSelector'

interface CreateRoomFormProps {
  roomId: string
}

type CreateRoomFormValues = z.infer<typeof createRoomSchema>

const TIME_OPTIONS = [50, 60, 75, 90]

export default function CreateRoomForm({ roomId }: CreateRoomFormProps) {
  const router = useRouter()
  const { setUser, user: zustandUser } = useUserStore(state => state)
  const setMembers = useMembersStore(state => state.setMembers)

  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const form = useForm<CreateRoomFormValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      username: '',
      timePerDraw: 90,
      roundCount: 2,
    },
  })

  const timePerDraw = form.watch('timePerDraw')
  const roundCount = form.watch('roundCount')

  function onSubmit({ username, timePerDraw, roundCount }: CreateRoomFormValues) {
    setIsLoading(true)
    socket.emit('create-room', {
      roomId,
      username,
      Avatar: zustandUser?.Avatar,
      timePerDraw,
      roundCount,
    })
  }

  useEffect(() => {
    socket.on('room-joined', ({ user, roomId, members }: RoomJoinedData) => {
      setUser(user)
      setMembers(members)
      router.replace(`/${roomId}`)
    })

    function handleErrorMessage({ message }: { message: string }) {
      toast('Failed to join room!', {
        description: message,
      })
    }

    socket.on('room-not-found', handleErrorMessage)
    socket.on('invalid-data', handleErrorMessage)

    return () => {
      socket.off('room-joined')
      socket.off('room-not-found')
      socket.off('invalid-data', handleErrorMessage)
    }
  }, [router, setUser, setMembers])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <div>
          <AvatarSelector isEditor />
        </div>

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-foreground'>Username</FormLabel>
              <FormControl>
                <Input placeholder='johndoe' {...field} />
              </FormControl>
              <FormMessage className='text-xs' />
            </FormItem>
          )}
        />

        <div>
          <p className='mb-2 text-sm font-medium'>Room ID</p>
          <div className='flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground'>
            <span>{roomId}</span>
            <CopyButton value={roomId} />
          </div>
        </div>

        {/* Game Settings Toggle */}
        <div className='rounded-lg border border-border overflow-hidden'>
          <button
            type='button'
            onClick={() => setShowSettings(v => !v)}
            className='flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors'
          >
            <span className='flex items-center gap-2 text-foreground'>
              <Settings2 className='h-4 w-4 text-muted-foreground' />
              Game Settings
            </span>
            {showSettings ? (
              <ChevronUp className='h-4 w-4 text-muted-foreground' />
            ) : (
              <ChevronDown className='h-4 w-4 text-muted-foreground' />
            )}
          </button>

          {showSettings && (
            <div className='border-t border-border bg-muted/20 px-4 py-4 flex flex-col gap-5'>

              {/* Time Per Draw */}
              <FormField
                control={form.control}
                name='timePerDraw'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between mb-3'>
                      <FormLabel className='flex items-center gap-2 text-sm font-medium text-foreground'>
                        <Clock className='h-4 w-4 text-muted-foreground' />
                        Draw Time
                      </FormLabel>
                      <span className='text-sm font-semibold tabular-nums rounded-md bg-background border border-border px-2 py-0.5 min-w-[44px] text-center'>
                        {timePerDraw}s
                      </span>
                    </div>
                    <FormControl>
                      <div>
                        <Slider
                          min={0}
                          max={TIME_OPTIONS.length - 1}
                          step={1}
                          value={[TIME_OPTIONS.indexOf(field.value)]}
                          onValueChange={([i]) => field.onChange(TIME_OPTIONS[i])}
                          className='mb-2'
                        />
                        <div className='flex justify-between mt-1'>
                          {TIME_OPTIONS.map(t => (
                            <button
                              key={t}
                              type='button'
                              onClick={() => field.onChange(t)}
                              className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                                timePerDraw === t
                                  ? 'bg-primary text-primary-foreground font-semibold'
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {t}s
                            </button>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />

              {/* Round Count */}
              <FormField
                control={form.control}
                name='roundCount'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between mb-3'>
                      <FormLabel className='flex items-center gap-2 text-sm font-medium text-foreground'>
                        <RefreshCcw className='h-4 w-4 text-muted-foreground' />
                        Rounds
                      </FormLabel>
                      <span className='text-sm font-semibold tabular-nums rounded-md bg-background border border-border px-2 py-0.5 min-w-[44px] text-center'>
                        {roundCount}
                      </span>
                    </div>
                    <FormControl>
                      <div>
                        <Slider
                          min={1}
                          max={10}
                          step={1}
                          value={[field.value]}
                          onValueChange={([v]) => field.onChange(v)}
                          className='mb-2'
                        />
                        <div className='flex justify-between px-0.5 mt-1'>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                            <button
                              key={n}
                              type='button'
                              onClick={() => field.onChange(n)}
                              className={`text-[10px] w-5 h-5 rounded transition-colors ${
                                roundCount === n
                                  ? 'bg-primary text-primary-foreground font-semibold'
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />

            </div>
          )}
        </div>

        <Button disabled={isLoading} type='submit' className='mt-1 w-full'>
          {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Create a Room'}
        </Button>
      </form>
    </Form>
  )
}
