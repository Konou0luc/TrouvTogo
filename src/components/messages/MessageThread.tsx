// src/components/messages/MessageThread.tsx
'use client'

import { useState } from 'react'
import { Message, User } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, Image as ImageIcon, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface MessageThreadProps {
  messages: Message[]
  currentUser: User
  otherUser: { name: string; avatar: string | null }
}

export default function MessageThread({ messages, currentUser, otherUser }: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    // In a real app, we would call the API here
    setNewMessage('')
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isMe && (
                  <Avatar className="h-8 w-8 mt-auto shrink-0">
                    <AvatarImage src={otherUser.avatar || ''} />
                    <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div className="space-y-1">
                  <div className={`p-3 rounded-2xl text-sm ${
                    isMe 
                      ? 'bg-primary text-white rounded-br-none shadow-sm' 
                      : 'bg-neutral-100 text-neutral-900 rounded-bl-none'
                  }`}>
                    {msg.content}
                  </div>
                  <p className={`text-[10px] text-neutral-400 font-medium ${isMe ? 'text-right' : 'text-left'}`}>
                    {format(new Date(msg.createdAt), 'HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="text-neutral-400 shrink-0">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 h-11 bg-neutral-50 border-neutral-200 focus:bg-white rounded-full"
          />
          <Button 
            type="submit" 
            size="icon" 
            className={`shrink-0 h-11 w-11 rounded-full shadow-md transition-all ${
              newMessage.trim() ? 'bg-primary hover:bg-primary-dark' : 'bg-neutral-200 cursor-not-allowed'
            }`}
            disabled={!newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
