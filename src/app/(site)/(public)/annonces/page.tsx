'use client'

import { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { fetchCategories, fetchObjetsPage } from '@/lib/api'
import type { BackendCategorie } from '@/lib/backend-types'
import type { Item, ItemType } from '@/types'
import AnnonceCard from '@/components/annonce/AnnonceCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'
import {
  Search,
  Map as MapIcon,
  List as ListIcon,
  MapPin,
  Navigation,
  X,
  PlusCircle,
  ArrowRight,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import SkeletonCard from '@/components/ui/SkeletonCard'
import { useMinWidth } from '@/hooks/useMinWidth'

const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center bg-muted dark:bg-neutral-800/80">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-card">
          <MapPin className="h-7 w-7 text-primary/50" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-medium text-muted-foreground">Chargement de la carte…</p>
      </div>
    </div>
  ),
})

const ALL_CITIES = [
  { value: 'ALL', label: 'Toutes les villes' },
  { value: 'Lomé', label: 'Lomé' },
  { value: 'Kpalimé', label: 'Kpalimé' },
  { value: 'Sokodé', label: 'Sokodé' },
  { value: 'Atakpamé', label: 'Atakpamé' },
  { value: 'Kara', label: 'Kara' },
  { value: 'Dapaong', label: 'Dapaong' },
]

const SORT_OPTIONS = [
  { value: 'RECENT', label: 'Plus récent' },
  { value: 'RELEVANCE', label: 'Pertinence' },
  { value: 'DISTANCE', label: 'Distance' },
  { value: 'MATCH_SCORE', label: 'Score de match' },
]

/** Visuel hero type SaaS (coins très arrondis, bordure — sans ombre) */
const ANNONCES_HERO_IMAGE =
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85'

export default function AnnoncesPage() {
  const isLg = useMinWidth(1024)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [filterCity, setFilterCity] = useState('ALL')
  const [sortBy, setSortBy] = useState('RECENT')
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [apiItems, setApiItems] = useState<Item[]>([])
  const [categoryIds, setCategoryIds] = useState<Record<string, number>>({})
  const [categoryFilterOptions, setCategoryFilterOptions] = useState<
    { value: string; label: string }[]
  >([{ value: 'ALL', label: 'Toutes catégories' }])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400)
    return () => clearTimeout(t)
  }, [searchQuery])

  useEffect(() => {
    fetchCategories()
      .then((cats: BackendCategorie[]) => {
        const m: Record<string, number> = {}
        cats.forEach((c) => {
          m[c.nom] = c.id
        })
        setCategoryIds(m)
        setCategoryFilterOptions([
          { value: 'ALL', label: 'Toutes catégories' },
          ...cats.map((c) => ({
            value: c.nom,
            label: c.description?.trim() || c.nom,
          })),
        ])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    const typeParam: ItemType | undefined =
      filterType === 'ALL' ? undefined : (filterType as ItemType)
    const categorieId =
      filterCategory !== 'ALL' ? categoryIds[filterCategory] : undefined

    fetchObjetsPage({
      keyword: debouncedSearch.trim() || undefined,
      type: typeParam,
      categorieId,
      size: 120,
    })
      .then(({ items }) => {
        if (!cancelled) setApiItems(items)
      })
      .catch(() => {
        if (!cancelled) setApiItems([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [debouncedSearch, filterType, filterCategory, categoryIds])

  const filteredItems = useMemo(() => {
    let items = [...apiItems]

    if (filterCity !== 'ALL') {
      items = items.filter((i) => i.location.city === filterCity)
    }

    switch (sortBy) {
      case 'RECENT':
        items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      case 'RELEVANCE':
      case 'MATCH_SCORE':
        items.sort((a, b) => b.matchCount - a.matchCount)
        break
      case 'DISTANCE':
        if (userLocation) {
          items.sort((a, b) => {
            const da = Math.hypot(
              a.location.latitude - userLocation.lat,
              a.location.longitude - userLocation.lng
            )
            const db = Math.hypot(
              b.location.latitude - userLocation.lat,
              b.location.longitude - userLocation.lng
            )
            return da - db
          })
        }
        break
    }
    return items
  }, [apiItems, filterCity, sortBy, userLocation])

  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 6.1375, lng: 1.2123 })
      )
    } else setUserLocation({ lat: 6.1375, lng: 1.2123 })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setFilterType('ALL')
    setFilterCategory('ALL')
    setFilterCity('ALL')
    setSortBy('RECENT')
  }

  const hasActiveFilters =
    filterType !== 'ALL' || filterCategory !== 'ALL' || filterCity !== 'ALL' || searchQuery.length > 0

  const selectClass =
    'h-11 w-full rounded-xl border border-border bg-background px-3 text-left text-sm font-medium text-foreground hover:border-neutral-300 dark:hover:border-neutral-600'

  const filterPanel = (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-2 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">Affinez votre recherche</h2>
          <p className="mt-1 text-sm text-muted-foreground">Combinez les critères pour cibler un signalement.</p>
        </div>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={clearFilters}
            className="shrink-0 self-start rounded-full text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="mr-1.5 h-4 w-4" strokeWidth={1.75} />
            Réinitialiser
          </Button>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:items-end lg:gap-6">
        <div className="lg:col-span-5">
          <label className="mb-2 block text-xs font-medium text-muted-foreground">Recherche</label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-400"
              strokeWidth={1.75}
            />
            <Input
              placeholder="Objet, quartier, mots-clés…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 rounded-xl border-border bg-muted/80 pl-11 text-[15px] text-foreground placeholder:text-muted-foreground focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-neutral-600 dark:bg-neutral-900/50 dark:focus-visible:bg-neutral-900"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:col-span-2 lg:col-span-7 lg:grid-cols-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Type</label>
            <Select value={filterType} onValueChange={(v) => v && setFilterType(v)}>
              <SelectTrigger className={selectClass}>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL">Tous</SelectItem>
                <SelectItem value="LOST">Perdus</SelectItem>
                <SelectItem value="FOUND">Trouvés</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Ville</label>
            <Select value={filterCity} onValueChange={(v) => v && setFilterCity(v)}>
              <SelectTrigger className={selectClass}>
                <SelectValue placeholder="Ville" />
              </SelectTrigger>
              <SelectContent className="max-h-[min(280px,60vh)] rounded-xl">
                {ALL_CITIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Catégorie</label>
            <Select value={filterCategory} onValueChange={(v) => v && setFilterCategory(v)}>
              <SelectTrigger className={selectClass}>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent className="max-h-[min(280px,60vh)] rounded-xl">
                {categoryFilterOptions.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Tri</label>
            <Select value={sortBy} onValueChange={(v) => v && setSortBy(v)}>
              <SelectTrigger className={selectClass}>
                <SelectValue placeholder="Tri" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )

  const listHeader = (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-6 py-6 sm:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">Résultats</p>
        <p className="mt-2 font-heading text-2xl font-medium text-foreground">Signalements</p>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="tabular-nums font-medium text-foreground">{filteredItems.length}</span>{' '}
          fiche{filteredItems.length > 1 ? 's' : ''} correspondant à vos critères
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={handleGeolocate}
        className="h-10 rounded-full border-border bg-card px-4 text-sm font-medium text-foreground"
      >
        <Navigation className="mr-2 h-4 w-4 text-primary" strokeWidth={1.75} />
        Autour de moi
      </Button>
    </div>
  )

  const listBody = (
    <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        filteredItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.035, duration: 0.35 }}
          >
            <AnnonceCard item={item} />
          </motion.div>
        ))
      ) : (
        <EmptyState />
      )}
    </div>
  )

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-background">
      {/* Hero deux colonnes — esprit landing pro (type WeHeal), palette TrouvTogo */}
      <section className="border-b border-border bg-background dark:border-neutral-800/80">
        <div className="mx-auto grid max-w-[90rem] items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-20 xl:gap-20">
          <div className="order-2 max-w-xl lg:order-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Annuaire citoyen</p>
            <h1 className="display-heading mt-5 text-4xl font-medium leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[2.65rem] xl:text-[3.1rem]">
              Retrouver ou restituer un objet, tout en clarté.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Une vue liste et une carte synchronisées : parcourez les signalements près de chez vous et agissez sans
              friction.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/declarer/perdu">
                <Button className="h-12 w-full rounded-full border border-primary bg-primary px-8 text-[15px] font-medium text-white hover:bg-primary-dark sm:w-auto">
                  <PlusCircle className="mr-2 h-[18px] w-[18px]" strokeWidth={1.75} />
                  J&apos;ai perdu quelque chose
                </Button>
              </Link>
              <Link href="/declarer/trouve">
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-full border-border bg-card px-8 text-[15px] font-medium text-foreground hover:bg-muted sm:w-auto"
                >
                  J&apos;ai trouvé un objet
                </Button>
              </Link>
            </div>
            <Link
              href="#recherche-annonces"
              className="mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-primary transition-colors hover:text-primary-dark"
            >
              Parcourir les annonces
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.25rem] border border-border bg-muted sm:aspect-[5/4] lg:aspect-[4/3] xl:rounded-[2.5rem]">
              <Image
                src={ANNONCES_HERO_IMAGE}
                alt="Interface et données pour suivre des signalements"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.12] via-transparent to-secondary/[0.08]" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs font-medium text-muted-foreground">Liste & carte</p>
                <p className="mt-0.5 font-heading text-sm font-medium text-foreground">Même base de données, deux façons de lire la ville.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="recherche-annonces" className="scroll-mt-24">
        <div className="relative z-10 -mt-6 px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[90rem]">{filterPanel}</div>
        </div>
      </div>

      {(filterType !== 'ALL' || filterCategory !== 'ALL' || filterCity !== 'ALL') && (
        <div className="mx-auto mt-8 max-w-[90rem] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-card/90 px-4 py-3">
            {filterType !== 'ALL' && (
              <Badge className="rounded-full border-0 bg-muted px-3 py-1 text-xs font-medium text-foreground">
                {filterType === 'LOST' ? 'Perdus' : 'Trouvés'}
                <button type="button" className="ml-2 text-muted-foreground hover:text-danger" onClick={() => setFilterType('ALL')}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filterCategory !== 'ALL' && (
              <Badge className="rounded-full border-0 bg-muted px-3 py-1 text-xs font-medium text-foreground">
                {categoryFilterOptions.find((c) => c.value === filterCategory)?.label}
                <button type="button" className="ml-2 text-muted-foreground hover:text-danger" onClick={() => setFilterCategory('ALL')}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filterCity !== 'ALL' && (
              <Badge className="rounded-full border-0 bg-muted px-3 py-1 text-xs font-medium text-foreground">
                {filterCity}
                <button type="button" className="ml-2 text-muted-foreground hover:text-danger" onClick={() => setFilterCity('ALL')}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="mx-auto mt-8 max-w-[90rem] flex-1 px-4 pb-16 sm:px-6 lg:mt-10 lg:px-10">
        {/* Une seule instance Leaflet à la fois : évite « container reused » + appendChild */}
        {!isLg ? (
          <div className="flex min-h-[60vh] flex-col">
            <Tabs defaultValue="list" className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-card/90">
              <div className="border-b border-border px-3 pt-3">
                <TabsList className="grid h-12 w-full grid-cols-2 gap-2 rounded-2xl bg-muted/80 p-1">
                  <TabsTrigger
                    value="list"
                    className="rounded-xl text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-none"
                  >
                    <ListIcon className="mr-2 h-4 w-4" strokeWidth={1.75} />
                    Liste
                  </TabsTrigger>
                  <TabsTrigger
                    value="map"
                    className="rounded-xl text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-foreground"
                  >
                    <MapIcon className="mr-2 h-4 w-4" strokeWidth={1.75} />
                    Carte
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="list" className="m-0 flex-1 overflow-y-auto bg-muted/40 p-4 dark:bg-neutral-950/40">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : filteredItems.length > 0 ? (
                  <div className="space-y-4">
                    {filteredItems.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                      >
                        <AnnonceCard item={item} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </TabsContent>
              <TabsContent value="map" className="relative m-0 min-h-[55vh]">
                <MapView items={filteredItems} center={userLocation ? [userLocation.lat, userLocation.lng] : undefined} />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="grid min-h-[min(720px,calc(100dvh-20rem))] gap-6 lg:grid-cols-[minmax(380px,44%)_1fr]">
            <div className="flex max-h-[min(820px,calc(100dvh-14rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card">
              {listHeader}
              {listBody}
            </div>

            <div className="relative min-h-[560px] overflow-hidden rounded-3xl border border-border bg-muted dark:border-neutral-700 dark:bg-neutral-800/60">
              <MapView items={filteredItems} center={userLocation ? [userLocation.lat, userLocation.lng] : undefined} />
              <div className="pointer-events-auto absolute right-6 top-6 z-[1000]">
                <Button
                  type="button"
                  onClick={handleGeolocate}
                  className="h-10 rounded-full border border-white/80 bg-white/95 px-4 text-sm font-medium text-neutral-800 backdrop-blur-sm hover:bg-white"
                >
                  <MapPin className="mr-2 h-4 w-4 text-primary" strokeWidth={1.75} />
                  Ma position
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Search className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <p className="font-heading text-lg font-medium text-foreground">Aucun résultat pour ces critères</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Élargissez la recherche ou réinitialisez les filtres pour voir plus de signalements.
      </p>
    </div>
  )
}
