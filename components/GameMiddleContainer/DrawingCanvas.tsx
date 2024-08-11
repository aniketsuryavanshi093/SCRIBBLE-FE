'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { DrawOptions, GameStateType } from '@/types'
import { useCanvasStore } from '@/stores/canvasStore'
import { useUserStore } from '@/stores/userStore'
import { socket } from '@/lib/socket'
import { draw, drawWithDataURL } from '@/lib/utils'
import useDraw, { type DrawProps } from '@/hooks/useDraw'
import { Skeleton } from '@/components/ui/Skeleton'
import UndoButton from '@/components/GameMiddleContainer/UndoButton'
import ClearButton from '@/components/GameMiddleContainer/ClearButton'
import { useGameStore } from '@/stores/gameStore'
import useGameStateContext from '@/context/useGameStateContext'
import SelectingWords from './SelectingWords'
import ShowPointsTable from './ShowPointsTable'

export default function DrawingCanvas() {
  const router = useRouter()
  const { roomId } = useParams()
  const { gameState } = useGameStore()
  const [Selecting, setSelecting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { setgameState } = useGameStateContext()
  const { showPointsTable } = useGameStore(state => state)
  const [isCanvasLoading, setIsCanvasLoading] = useState(true)

  const strokeColor = useCanvasStore(state => state.strokeColor)
  const strokeWidth = useCanvasStore(state => state.strokeWidth)
  const dashGap = useCanvasStore(state => state.dashGap)
  const user = useUserStore(state => state.user)

  useEffect(() => {
    if (!user) {
      router.replace('/')
    }
  }, [router, user])

  const onDraw = useCallback(
    ({ ctx, currentPoint, prevPoint }: DrawProps) => {
      const drawOptions = {
        ctx,
        currentPoint,
        prevPoint,
        strokeColor,
        strokeWidth,
        dashGap,
      }
      draw(drawOptions)
      socket.emit('draw', { drawOptions, roomId })
    },
    [strokeColor, strokeWidth, dashGap, roomId]
  )

  const { canvasRef, onInteractStart, clear, undo } = useDraw(onDraw)

  useEffect(() => {
    const canvasElement = canvasRef.current
    const ctx = canvasElement?.getContext('2d')

    socket.emit('client-ready', roomId)

    socket.on('client-loaded', () => {
      setIsCanvasLoading(false)
    })

    socket.on('get-canvas-state', () => {
      const canvasState = canvasRef.current?.toDataURL()
      if (!canvasState) return

      socket.emit('send-canvas-state', { canvasState, roomId })
    })

    socket.on(
      'canvas-state-from-server',
      ({ canvasState, gameState }: { canvasState: string; gameState: GameStateType }) => {
        if (!ctx || !canvasElement) return
        setgameState(gameState)
        drawWithDataURL(canvasState, ctx, canvasElement)
        setIsCanvasLoading(false)
      }
    )

    socket.on('update-canvas-state', (drawOptions: DrawOptions) => {
      if (!ctx) return
      draw({ ...drawOptions, ctx })
    })

    socket.on('undo-canvas', canvasState => {
      if (!ctx || !canvasElement) return

      drawWithDataURL(canvasState, ctx, canvasElement)
    })

    return () => {
      socket.off('get-canvas-state')
      socket.off('canvas-state-from-server')
      socket.off('update-canvas-state')
      socket.off('undo-canvas')
    }
  }, [canvasRef, roomId])

  useEffect(() => {
    const setCanvasDimensions = () => {
      if (!containerRef.current || !canvasRef.current) return

      const { width, height } = containerRef.current?.getBoundingClientRect()

      canvasRef.current.width = width - 50
      canvasRef.current.height = height - 50
    }

    setCanvasDimensions()
  }, [canvasRef])

  const handleInteractStart = () => {
    if (gameState?.drawer === user?.id) {
      const canvasElement = canvasRef.current
      if (!canvasElement) return

      socket.emit('add-undo-point', {
        roomId,
        undoPoint: canvasElement.toDataURL(),
      })
      onInteractStart()
    }
  }

  return (
    <div
      ref={containerRef}
      className={`${
        ((gameState && Selecting) || showPointsTable) && 'bgshadow'
      } relative flex h-full w-full items-center justify-center`}
    >
      <SelectingWords
        gameState={gameState!}
        setSelecting={setSelecting}
        user={user!}
        selecting={Selecting}
      />

      <ShowPointsTable gameState={gameState!} />

      {!isCanvasLoading && (
        <div className='absolute right-[25px] top-[25px] flex select-none rounded-none rounded-bl rounded-tr-[2.5px]'>
          {gameState?.drawer === user?.id && (
            <>
              <UndoButton undo={undo} />
              <ClearButton canvasRef={canvasRef} clear={clear} />
            </>
          )}
        </div>
      )}

      {isCanvasLoading && (
        <Skeleton className='absolute h-[calc(100%-50px)] w-[calc(100%-50px)]' />
      )}

      <canvas
        id='canvas'
        ref={canvasRef}
        onMouseDown={handleInteractStart}
        onTouchStart={handleInteractStart}
        width={0}
        height={0}
        className='h-full w-full touch-none rounded border bg-white'
      />
    </div>
  )
}
