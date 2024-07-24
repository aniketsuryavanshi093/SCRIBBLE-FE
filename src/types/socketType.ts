/* eslint-disable @typescript-eslint/no-unused-vars */
import { Socket } from "socket.io-client";

export type ScoketHookType = {
    socket: Socket,
    setSocket: (Socket: Socket) => null,
}


export type User = {
    username: string
    userId: string
    isDrawer: boolean
    isAdmin: boolean
}