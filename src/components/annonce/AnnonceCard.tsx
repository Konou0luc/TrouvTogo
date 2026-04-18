'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Item } from '@/types'
import { MapPin, Calendar, ArrowUpRight } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import CategoryBadge from './CategoryBadge'
import StatusBadge from './StatusBadge'
import RewardBadge from './RewardBadge'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const IMG = 'h-[104px] w-[104px] shrink-0 sm:h-[120px] sm:w-[120px]'

export default function AnnonceCard({ item }: { item: Item }) {
  const isLost = item.type === 'LOST'
  const [imageError, setImageError] = useState(false)

  return (
    <Link href={`/annonces/${item.id}`} className="block h-full">
      <article
        className={cn(
          'group relative flex h-full min-h-[168px] gap-4 rounded-3xl border border-neutral-200/50 bg-card p-4 transition-[border-color,transform] duration-300 dark:border-neutral-700/70',
          'sm:min-h-[184px] sm:gap-5 sm:p-5',
          'hover:border-primary/40'
        )}
      >
        <div className={cn('relative overflow-hidden rounded-2xl bg-muted dark:bg-neutral-800', IMG)}>
          <Image
            src={
              imageError
                ? 'https://images.unsplash.com/photo-1695643875095-f5620748605d?w=800&auto=format&fit=crop'
                : item.images[0]
            }
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="120px"
            onError={() => setImageError(true)}
          />
          <span
            className={cn(
              'absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white',
              isLost ? 'bg-danger/95' : 'bg-secondary/95'
            )}
          >
            {isLost ? 'Perdu' : 'Trouvé'}
          </span>
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {/* Ligne catégorie + récompense : hauteur fixe pour éviter les sauts */}
          <div className="flex h-8 shrink-0 items-center gap-2">
            <CategoryBadge category={item.category} label={item.categoryDisplayName} />
            <div className="flex min-h-[1.5rem] min-w-0 flex-1 items-center">
              {item.reward ? (
                <RewardBadge reward={item.reward} />
              ) : (
                <span className="sr-only">Pas de récompense</span>
              )}
            </div>
          </div>

          {/* Bloc texte : hauteurs fixes pour toutes les cartes */}
          <div className="mt-2 min-h-0 flex-1">
            <h3
              className={cn(
                'font-heading text-[17px] font-semibold leading-snug tracking-tight text-card-foreground transition-colors',
                'line-clamp-2 min-h-[2.75rem] sm:text-lg',
                'group-hover:text-primary dark:group-hover:text-primary'
              )}
            >
              {item.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
              {item.description}
            </p>
          </div>

          {/* Pied : une seule ligne, alignements stables */}
          <div className="mt-3 flex shrink-0 items-center justify-between gap-2 border-t border-neutral-200/50 pt-3 dark:border-neutral-700/60 sm:mt-4">
            <div className="flex min-w-0 flex-1 items-center gap-3 text-[12px] text-muted-foreground sm:gap-4">
              <span className="inline-flex min-w-0 max-w-[45%] items-center gap-1.5 sm:max-w-[50%]">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/80" strokeWidth={1.75} />
                <span className="truncate">{item.location.district}</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap">
                <Calendar className="h-3.5 w-3.5 text-primary/80" strokeWidth={1.75} />
                {format(new Date(item.date), 'd MMM yyyy', { locale: fr })}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <StatusBadge status={item.status} />
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-neutral-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary dark:text-neutral-500"
                strokeWidth={1.75}
              />
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
