import type { User } from '@/stores/userStore'
import type { DrawProps } from '@/hooks/useDraw'

export interface RoomJoinedData {
  user: User
  roomId: string
  members: User[]
}

export interface Notification {
  title: string
  message: string
}

export interface DrawOptions extends DrawProps {
  strokeColor: string
  strokeWidth: number[]
  dashGap: number[]
}
export interface GameStateType {
  gameState: 'started' | 'not-started' | 'choosing-word' | 'guessing-word'
  drawer: string
  word: string
  score: Scoretype
  lastGuesstime: number
  guessedWordUserState?: Record<
    string,
    {
      isGuessed: boolean
      guessedTime: number
    }
  > | null
  currentRound: number
}

export type Scoretype = Record<
  string,
  {
    score: number
    worddrawoccurance: string
  }
>
