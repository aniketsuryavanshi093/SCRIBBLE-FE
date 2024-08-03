import ColorPicker from '@/components/ColorPicker'
import StrokeWidthSlider from '@/components/StrokeWidthSlider'
import DashGapSlider from '@/components/DashGapSlider'
import LeaveButton from '@/components/LeaveButton'

export default function GameInfoContainer() {
  return (
    <div className='hidden flex-[3] border-l px-6 py-8 lg:block'>
      <div className='relative flex h-full w-[12.5rem] flex-col gap-6'>
        <ColorPicker />

        <StrokeWidthSlider />

        <DashGapSlider />

        <LeaveButton />
      </div>
    </div>
  )
}
