'use client'
import ColorPicker from '@/components/ColorPicker'
import StrokeWidthSlider from '@/components/StrokeWidthSlider'
import Messages from './Messages/Messages'
import { useUserStore } from '@/stores/userStore'
import useGameStateContext from '@/context/useGameStateContext'

export default function GameInfoContainer() {
  const { user } = useUserStore(state => state)
  const { GameState } = useGameStateContext()
  console.log(GameState?.drawer, user?.id)
  return (
    <div className='hidden flex-[3] border-l bg-slate-100 px-6 py-8 lg:block'>
      <div className='relative flex h-full w-full flex-col gap-6'>
        {GameState?.drawer === user?.id && (
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
