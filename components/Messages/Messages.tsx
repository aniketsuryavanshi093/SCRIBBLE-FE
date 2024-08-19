'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Input } from '../ui/Input'
import { socket } from '@/lib/socket'
import { Message, useUserStore } from '@/stores/userStore'
import './message.css'
import { useGameStore } from '@/stores/gameStore'

const Messages = () => {
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const messageListRef = useRef<HTMLDivElement>(null)
  const { user } = useUserStore(state => state)
  const { gameState } = useGameStore(state => state)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }

  useEffect(() => {
    socket.on('recieve-broadcasted-message', (data: Message) => {
      setMessages(prev => [...prev, data])
      scrollToBottom()
    })

    return () => {
      socket.off('recieve-broadcasted-message')
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmitMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && message.trim() !== '') {
      socket.emit('broadcast-mesage', {
        userid: user?.id,
        roomId: user?.roomId,
        message: message.trim(),
        username: user?.username,
      })
      if (message?.trim() === gameState?.word && gameState?.drawer !== user?.id) {
        socket.emit('guessed-word', {
          userId: user?.id,
          roomId: user?.roomId,
          guessTime: parseInt(document.getElementById('timer')?.textContent!),
        })
      }
      setMessage('')
    }
  }
  return (
    <div className='flex h-full w-full flex-col items-end justify-end'>
      <div ref={messageListRef} className='messagelist w-full overflow-y-auto'>
        {messages.map((msg, index) => (
          <div key={index} className='mb-2 w-full text-black'>
            <span className='font-bold'>{msg.username}:</span>
            <span
              className={`${
                msg.message === gameState?.word! && 'text-green-600'
              } text-sm font-semibold`}
            >
              {msg.message}
            </span>
          </div>
        ))}
      </div>
      <Input
        placeholder='Guess word'
        onKeyDown={handleSubmitMessage}
        value={message}
        onChange={handleChange}
      />
    </div>
  )
}

export default Messages
