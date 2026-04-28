// src/app/(app)/messages/page.tsx
"use client"

import { useEffect, useState } from 'react'
import { fetchConversations } from '@/lib/api'
import ConversationList from '@/components/messages/ConversationList'
import { MessageSquare } from 'lucide-react'

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    fetchConversations()
      .then((c) => {
        if (!mounted) return
        setConversations(c)
      })
      .catch(() => setConversations([]))
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="bg-card min-h-[calc(100vh-64px)] flex flex-col md:flex-row">
      {/* Sidebar: Conversation List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-neutral-100 flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-neutral-900">Messages</h1>
        </div>
          <div className="flex-1 overflow-y-auto">
          <ConversationList conversations={conversations} />
        </div>
      </div>

      {/* Main: Empty State or Thread */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-neutral-50/50">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-neutral-200 bg-card text-neutral-200">
            <MessageSquare className="h-10 w-10" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mb-2">Sélectionnez une conversation</h3>
          <p className="text-sm text-neutral-500 max-w-xs mx-auto leading-relaxed">
            Choisissez un échange dans la liste pour voir les messages et contacter la personne.
          </p>
        </div>
      </div>
    </div>
  )
}
