import ColorPicker from '@/components/ColorPicker'
import StrokeWidthSlider from '@/components/StrokeWidthSlider'
import Messages from './Messages/Messages'

export default function GameInfoContainer() {
  return (
    <div className='hidden flex-[3] border-l bg-slate-100 px-6 py-8 lg:block'>
      <div className='relative flex h-full w-full flex-col gap-6'>
        <ColorPicker />
        <StrokeWidthSlider />
        <Messages />
      </div>
    </div>
  )
}
