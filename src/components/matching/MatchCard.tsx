// src/components/matching/MatchCard.tsx
import { MatchResult } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, MessageSquare, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Link from 'next/link'
import MatchScoreBar from './MatchScoreBar'
import StatusBadge from '../annonce/StatusBadge'

export default function MatchCard({ match }: { match: MatchResult }) {
  const item = match.targetItem
  
  return (
    <Card className="overflow-hidden border-neutral-200 transition-colors hover:border-neutral-300">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Item Image */}
          <div className="relative w-full sm:w-1/3 aspect-video sm:aspect-auto bg-neutral-100 min-h-[140px]">
            {item.images.length > 0 ? (
              <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-300">
                <MapPin className="h-8 w-8 opacity-20" />
              </div>
            )}
          </div>

          {/* Match Info */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-bold text-neutral-900 leading-tight line-clamp-1">{item.title}</h4>
                <StatusBadge status={item.status} />
              </div>

              <MatchScoreBar score={match.score} keywords={match.matchedKeywords} />

              <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-medium">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{item.location.district} {match.distanceKm && `(${match.distanceKm}km)`}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(item.date), 'dd MMM yyyy', { locale: fr })}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Link href={`/annonces/${item.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full h-9 text-xs gap-2">
                  <ExternalLink className="h-3.3 w-3.5" />
                  Détails
                </Button>
              </Link>
              <Button size="sm" className="flex-1 h-9 text-xs bg-primary hover:bg-primary-dark gap-2 font-bold">
                <MessageSquare className="h-3.5 w-3.5" />
                Contacter
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
