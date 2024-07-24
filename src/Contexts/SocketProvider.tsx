import React, { ReactNode, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import SocketContext from './SocketContext';

export const SOCKET_EVENTS = {
    JOIN: 'join',
    MARK_AS_READ: 'mark_as_read',
    MARK_ALL_AS_READ: 'mark_all_as_read',
    NOTIFICATIONS_LIST: 'notification_list',
    NOTIFICATION: 'notification',
    CONNECTION: 'connection',
    DELETE: 'delete',
    DISCONNECT: 'disconnect',
};


export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    const connectSocket = () => {
        const newSocket = io("http://localhost:8080", {
            autoConnect: true,
        });
        console.log(newSocket, 'newSocket');
        newSocket.on('connect_error', err => {
            console.error('Connection Error: sssssssssssss', err);
        });
        newSocket.on('connect', () => {
            console.log(newSocket);
            setSocket(newSocket);
            console.log('Connected to Socket.IO server ssssssssssss');
        });
    };

    useEffect(() => {
        connectSocket();
    }, []);

    const joinRoom = (room: string) => {
        socket?.emit(SOCKET_EVENTS.JOIN, room);
    };

    const markAsRead = (id: string) => {
        socket?.emit(SOCKET_EVENTS.MARK_AS_READ, id);
    };

    const markAllAsRead = () => {
        socket?.emit(SOCKET_EVENTS.MARK_ALL_AS_READ);
    };

    const deleteNotification = (id: string) => {
        socket?.emit(SOCKET_EVENTS.DELETE, id);
    };

    const value = {
        socket,
        setSocket,
        joinRoom,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        connectSocket,
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};