// src/app/(app)/messages/[id]/page.tsx
"use client"

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fetchConversations, fetchConversationMessages } from '@/lib/api'
import ConversationList from '@/components/messages/ConversationList'
import MessageThread from '@/components/messages/MessageThread'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Info, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default function ConversationPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAppStore()
  const [conversations, setConversations] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [conversation, setConversation] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true
    fetchConversations()
      .then((c) => { if (!mounted) return; setConversations(c) })
      .catch(() => setConversations([]))
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const convId = Number(id)
    if (!convId) return
    let mounted = true
    fetchConversationMessages(convId)
      .then((m) => { if (!mounted) return; setMessages(m) })
      .catch(() => setMessages([]))

    fetchConversations()
      .then((c) => { if (!mounted) return; setConversation(c.find((x: any) => x.id === convId) ?? null) })
      .catch(() => setConversation(null))

    return () => { mounted = false }
  }, [id])

  if (!user) return null

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Conversation introuvable</p>
      </div>
    )
  }

  return (
    <div className="bg-card h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Sidebar: hidden on mobile when viewing a thread */}
      <div className="hidden md:flex w-80 lg:w-96 border-r border-neutral-100 flex-col shrink-0">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-neutral-900">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationList conversations={conversations} />
        </div>
      </div>

      {/* Main: Message Thread */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-50/30">
        {/* Thread Header */}
        <div className="bg-card border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden shrink-0"
              onClick={() => router.push('/messages')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col min-w-0">
              <h3 className="font-bold text-neutral-900 truncate">{conversation.otherUser.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Objet :</span>
                <Link href={`/annonces/${conversation.item.id}`} className="text-[10px] font-bold text-primary hover:underline truncate max-w-[150px]">
                  {conversation.item.title}
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex items-center gap-1 bg-secondary/5 text-secondary border-secondary/20">
              <div className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
              Match {conversation.matchScore}%
            </Badge>
            <Button variant="ghost" size="icon" className="text-neutral-400">
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <MessageThread 
            messages={messages} 
            currentUser={user} 
            otherUser={conversation.otherUser} 
          />
        </div>
      </div>
    </div>
  )
}
