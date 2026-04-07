// src/app/(app)/notifications/page.tsx
'use client'

import { MOCK_NOTIFICATIONS } from '@/lib/mockData'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Bell, 
  Zap, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Trash2,
  Check
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import Link from 'next/link'

export default function NotificationsPage() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'NEW_MATCH_HIGH': return { icon: Zap, color: 'text-accent', bg: 'bg-accent-light' }
      case 'NEW_MESSAGE': return { icon: MessageSquare, color: 'text-primary', bg: 'bg-primary-light' }
      case 'ITEM_RESOLVED': return { icon: CheckCircle2, color: 'text-secondary', bg: 'bg-secondary-light' }
      default: return { icon: Bell, color: 'text-neutral-400', bg: 'bg-neutral-100' }
    }
  }

  return (
    <div className="bg-neutral-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-neutral-900">Notifications</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-xs text-neutral-500 hover:text-primary gap-2">
              <Check className="h-4 w-4" />
              Tout marquer comme lu
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {MOCK_NOTIFICATIONS.length > 0 ? (
            MOCK_NOTIFICATIONS.map((notif) => {
              const { icon: Icon, color, bg } = getIcon(notif.type)
              return (
                <Link key={notif.id} href={notif.actionUrl}>
                  <div className={`p-5 rounded-2xl border transition-all hover:shadow-md mb-4 bg-white ${
                    !notif.isRead ? 'border-primary/20 shadow-sm' : 'border-neutral-100'
                  }`}>
                    <div className="flex gap-4">
                      <div className={`h-12 w-12 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-neutral-900' : 'font-medium text-neutral-600'}`}>
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-neutral-400 font-medium whitespace-nowrap ml-4">
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: fr })}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 leading-relaxed mb-3">
                          {notif.content}
                        </p>
                        {!notif.isRead && (
                          <Badge className="bg-primary text-[10px] h-4 px-1.5 font-bold uppercase tracking-wider">
                            Nouveau
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="py-20 text-center">
              <div className="h-20 w-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
                <Bell className="h-10 w-10 text-neutral-300" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Aucune notification</h3>
              <p className="text-sm text-neutral-500">Vous êtes à jour !</p>
            </div>
          )}
        </div>

        {MOCK_NOTIFICATIONS.length > 0 && (
          <Button variant="ghost" className="w-full mt-8 text-neutral-400 hover:text-danger gap-2">
            <Trash2 className="h-4 w-4" />
            Effacer tout l'historique
          </Button>
        )}
      </div>
    </div>
  )
}
