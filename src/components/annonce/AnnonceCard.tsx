// src/components/annonce/AnnonceCard.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Item } from '@/types'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Sparkles, User as UserIcon, ArrowUpRight } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import CategoryBadge from './CategoryBadge'
import StatusBadge from './StatusBadge'
import RewardBadge from './RewardBadge'
import { useState } from 'react'

export default function AnnonceCard({ item }: { item: Item }) {
  const isLost = item.type === 'LOST'
  const [imageError, setImageError] = useState(false)
  
  return (
    <Link href={`/annonces/${item.id}`}>
      <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-700 h-[260px] flex">
        {/* Visual Side: High Impact */}
        <div className="relative w-2/5 h-full overflow-hidden shrink-0 bg-neutral-100">
          <Image
            src={imageError ? 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=800&auto=format&fit=crop' : item.images[0]}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
            sizes="(max-width: 768px) 40vw, 20vw"
            onError={() => setImageError(true)}
          />
          
          {/* Status Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          
          <div className="absolute top-6 left-6 z-10">
            <Badge className={`px-4 py-1.5 rounded-full border-none font-black text-[10px] uppercase tracking-widest shadow-2xl ${isLost ? 'bg-danger text-white' : 'bg-secondary text-white'}`}>
              {isLost ? 'Objet Perdu' : 'Objet Trouvé'}
            </Badge>
          </div>

          <div className="absolute bottom-6 left-6 z-10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full border-2 border-white overflow-hidden shadow-lg">
                <Image 
                  src={item.user.avatar || ''} 
                  alt={item.user.name} 
                  width={32} 
                  height={32} 
                  className="object-cover"
                />
              </div>
              <span className="text-[10px] font-black text-white uppercase tracking-wider">{item.user.name.split(' ')[0]}</span>
            </div>
          </div>
        </div>

        {/* Content Side: Professional Layout */}
        <div className="flex-1 p-8 flex flex-col justify-between min-w-0 relative">
          {/* Subtle Corner Icon */}
          <ArrowUpRight className="absolute top-8 right-8 h-5 w-5 text-neutral-200 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <CategoryBadge category={item.category} />
              {item.reward && <RewardBadge reward={item.reward} />}
            </div>

            <h3 className="font-black text-neutral-900 text-2xl leading-[1.1] tracking-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
              {item.title}
            </h3>
            
            <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed font-medium mb-6">
              {item.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-neutral-50">
            <div className="flex items-center gap-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em]">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="truncate max-w-[100px]">{item.location.district}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{format(new Date(item.date), 'dd MMM', { locale: fr })}</span>
              </div>
            </div>
            
            <StatusBadge status={item.status} />
          </div>
        </div>
      </div>
    </Link>
  )
}
