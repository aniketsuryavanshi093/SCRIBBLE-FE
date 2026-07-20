import { io } from 'socket.io-client'

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'

export const socket = io(SERVER, { transports: ['websocket'] })
