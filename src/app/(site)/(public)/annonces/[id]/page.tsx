// src/app/(public)/annonces/[id]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { fetchObjetById, fetchObjetsPage } from '@/lib/api'
import type { Item } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  MapPin,
  Calendar,
  MessageSquare,
  Share2,
  AlertTriangle,
  ChevronLeft,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import CategoryBadge from '@/components/annonce/CategoryBadge'
import StatusBadge from '@/components/annonce/StatusBadge'
import RewardBadge from '@/components/annonce/RewardBadge'
import { useAppStore } from '@/store/useAppStore'
import AnnonceCard from '@/components/annonce/AnnonceCard'

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false })

export default function AnnonceDetailPage() {
  const { id } = useParams()
  const { user } = useAppStore()
  const [item, setItem] = useState<Item | null>(null)
  const [similarItems, setSimilarItems] = useState<Item[]>([])
  const [loadError, setLoadError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const numId = Number(id)
    if (!Number.isFinite(numId)) {
      setLoadError(true)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoadError(false)
    setLoading(true)
    fetchObjetById(numId)
      .then((data) => {
        if (!cancelled) {
          setItem(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true)
          setItem(null)
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    if (!item?.categoryId) {
      setSimilarItems([])
      return
    }
    let cancelled = false
    fetchObjetsPage({ categorieId: item.categoryId ?? undefined, size: 24 })
      .then(({ items }) => {
        if (cancelled) return
        setSimilarItems(
          items.filter((i) => i.id !== item.id).slice(0, 3)
        )
      })
      .catch(() => {
        if (!cancelled) setSimilarItems([])
      })
    return () => {
      cancelled = true
    }
  }, [item])

  if (loading) {
    return (
      <div className="container mx-auto bg-background px-4 py-20 text-center">
        <p className="text-muted-foreground">Chargement de l&apos;annonce…</p>
      </div>
    )
  }

  if (loadError || !item) {
    return (
      <div className="container mx-auto bg-background px-4 py-20 text-center">
        <h1 className="mb-4 font-heading text-2xl font-semibold text-foreground">
          Annonce introuvable
        </h1>
        <Link href="/annonces">
          <Button>Retour aux annonces</Button>
        </Link>
      </div>
    )
  }

  const isOwner = user?.id === item.userId
  const isLost = item.type === 'LOST'

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/annonces"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Retour aux annonces
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-neutral-200/50 bg-card dark:border-neutral-700/70">
              <div className="relative flex aspect-video items-center justify-center bg-muted">
                {item.images.length > 0 ? (
                  <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Clock className="mb-2 h-16 w-16 opacity-30" />
                    <span className="text-sm font-medium">Aucune photo disponible</span>
                  </div>
                )}
                <div className="absolute left-4 top-4 flex gap-2">
                  <Badge className={isLost ? 'bg-danger px-4 py-1 text-lg text-white' : 'bg-secondary px-4 py-1 text-lg text-white'}>
                    {isLost ? 'Perdu' : 'Trouvé'}
                  </Badge>
                  {item.reward && <RewardBadge reward={item.reward} />}
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <CategoryBadge category={item.category} label={item.categoryDisplayName} />
                      <StatusBadge status={item.status} />
                    </div>
                    <h1 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">{item.title}</h1>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full border-neutral-200/60 dark:border-neutral-600">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-neutral-200/60 text-danger hover:bg-danger/5 hover:text-danger dark:border-neutral-600"
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-8 grid gap-6 rounded-xl border border-neutral-200/40 bg-muted/40 p-4 sm:grid-cols-2 dark:border-neutral-700/50 dark:bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200/60 bg-card dark:border-neutral-600">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">Lieu</p>
                      <p className="text-sm font-semibold text-foreground">
                        {item.location.district}, {item.location.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200/60 bg-card dark:border-neutral-600">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">Date</p>
                      <p className="text-sm font-semibold text-foreground">{format(new Date(item.date), 'PPPP', { locale: fr })}</p>
                    </div>
                  </div>
                </div>

                <div className="max-w-none">
                  <h3 className="mb-3 font-heading text-lg font-semibold text-foreground">Description</h3>
                  <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{item.description}</p>
                </div>

                {item.depositLocation && (
                  <div className="mt-8 flex gap-4 rounded-xl border border-secondary/20 bg-secondary-light/80 p-4 dark:border-secondary/30 dark:bg-secondary/10">
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-secondary dark:text-secondary" />
                    <div>
                      <p className="text-sm font-semibold text-secondary-dark dark:text-secondary">Lieu de dépôt</p>
                      <p className="text-sm opacity-90 dark:text-muted-foreground">{item.depositLocation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200/50 bg-card p-6 dark:border-neutral-700/70">
              <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">Localisation précise</h3>
              <div className="relative h-[300px] overflow-hidden rounded-xl">
                <MapView items={[item]} center={[item.location.latitude, item.location.longitude]} zoom={15} />
                <div className="absolute bottom-4 left-4 z-[1000] rounded-lg border border-neutral-200/60 bg-card/95 p-3 text-xs font-medium text-foreground backdrop-blur-sm dark:border-neutral-600">
                  {item.location.address}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="overflow-hidden border border-neutral-200/50 bg-card ring-0 dark:border-neutral-700/70">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary dark:bg-primary/25">
                    {item.user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-heading font-semibold text-foreground">{item.user.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Membre depuis {format(new Date(item.user.joinDate), 'MMMM yyyy', { locale: fr })}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <div
                            key={s}
                            className={`h-1.5 w-4 rounded-full ${s <= item.user.reputationScore / 20 ? 'bg-secondary' : 'bg-muted'}`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-[10px] font-bold text-secondary">{item.user.reputationScore}% confiance</span>
                    </div>
                  </div>
                </div>

                {isOwner ? (
                  <div className="space-y-3">
                    <Button className="h-12 w-full font-semibold bg-secondary text-white hover:bg-secondary-dark">
                      Marquer comme résolu
                    </Button>
                    <Button variant="outline" className="h-12 w-full border-neutral-200/60 dark:border-neutral-600">
                      Modifier l&apos;annonce
                    </Button>
                  </div>
                ) : (
                  <Button className="h-12 w-full gap-2 font-semibold">
                    <MessageSquare className="h-5 w-5" />
                    Contacter l&apos;annonceur
                  </Button>
                )}
              </CardContent>
            </Card>

            <div>
              <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">Annonces similaires</h3>
              <div className="space-y-4">
                {similarItems.length > 0 ? (
                  similarItems.map((similar) => <AnnonceCard key={similar.id} item={similar} />)
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune autre annonce dans cette catégorie pour l&apos;instant.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
