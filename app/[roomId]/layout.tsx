import GameHeader from '@/components/GameHeader'
import GameInfoContainer from '@/components/GameInfoContainer'
import SideBar from '@/components/Sidebar'

export default function RoomLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='bagclass h-[100vh] w-full'>
      <div className='m-auto h-full max-w-[1280px] py-[10px]'>
        <GameHeader />
        <div className='mainlayout flex flex-row items-stretch justify-center gap-2'>
          <SideBar />
          <main className='h-full flex-[7]'>{children}</main>
          <GameInfoContainer />
        </div>
      </div>
    </div>
  )
}
