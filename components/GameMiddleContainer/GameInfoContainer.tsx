'use client'
import ColorPicker from '@/components/ColorPicker'
import StrokeWidthSlider from '@/components/StrokeWidthSlider'
import Messages from '../Messages/Messages'
import { useUserStore } from '@/stores/userStore'
import { useGameStore } from '@/stores/gameStore'

export default function GameInfoContainer() {
  const { user } = useUserStore(state => state)
  const { gameState } = useGameStore()
  return (
    <div className='hidden flex-[3] border-l bg-slate-100 px-4 py-8 lg:block'>
      <div className='relative flex h-full w-full flex-col gap-6'>
        {gameState?.drawer === user?.id && (
          <>
            <ColorPicker />
            <StrokeWidthSlider />
          </>
        )}
        <Messages />
      </div>
    </div>
  )
}
