import DrawingCanvas from '@/components/GameMiddleContainer/DrawingCanvas'
import DisconnectedDialog from '@/components/DisconnectedDialog'

export default function RoomPage() {
  return (
    <>
      <DisconnectedDialog />
      <DrawingCanvas />
    </>
  )
}
