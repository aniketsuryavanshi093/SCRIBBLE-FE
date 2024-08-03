import Header from '@/components/Header'
import GameInfoContainer from '@/components/GameInfoContainer'
import SideBar from '@/components/Sidebar'

export default function RoomLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className='flex h-[calc(100vh-3.8rem)] flex-row items-stretch justify-center'>
        <SideBar />
        <main className='h-full flex-[7]'>{children}</main>
        <GameInfoContainer />
      </div>
    </>
  )
}
