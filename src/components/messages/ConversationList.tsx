// src/components/messages/ConversationList.tsx
'use client'

import { Conversation } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface ConversationListProps {
  conversations: Conversation[]
}

export default function ConversationList({ conversations }: ConversationListProps) {
  const { id } = useParams()

  return (
    <div className="divide-y border-t md:border-t-0">
      {conversations.length > 0 ? (
        conversations.map((conv) => {
          const isActive = id === String(conv.id)
          return (
            <Link 
              key={conv.id} 
              href={`/messages/${conv.id}`}
              className={`flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors ${
                isActive ? 'bg-primary-light/30 border-r-4 border-r-primary' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="h-12 w-12 border border-neutral-200">
                  <AvatarImage src={conv.otherUser.avatar || ''} />
                  <AvatarFallback className="bg-primary-light text-primary font-bold">
                    {conv.otherUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {conv.unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 p-0 flex items-center justify-center bg-danger border-2 border-white">
                    {conv.unreadCount}
                  </Badge>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="font-bold text-sm text-neutral-900 truncate">{conv.otherUser.name}</h4>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true, locale: fr })}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 font-bold truncate mb-1">
                  Re: {conv.item.title}
                </p>
                <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-neutral-900 font-bold' : 'text-neutral-400'}`}>
                  {conv.lastMessage.isFromMe ? 'Vous : ' : ''}{conv.lastMessage.content}
                </p>
              </div>
            </Link>
          )
        })
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-neutral-400">Aucune conversation</p>
        </div>
      )}
    </div>
  )
}
