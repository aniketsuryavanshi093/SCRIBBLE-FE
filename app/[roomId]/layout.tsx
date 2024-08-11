import GameHeader from '@/components/Gameheader/GameHeader'
import GameInfoContainer from '@/components/GameMiddleContainer/GameInfoContainer'
import SideBar from '@/components/Sidebar'
import GameStateManager from '@/context/GameStateManager'

export default function RoomLayout({ children }: { children: React.ReactNode }) {
  return (
    <GameStateManager>
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
    </GameStateManager>
  )
}
