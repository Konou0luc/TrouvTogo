// src/app/(public)/annonces/page.tsx
'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { MOCK_ITEMS } from '@/lib/mockData'
import AnnonceCard from '@/components/annonce/AnnonceCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Map as MapIcon, 
  List as ListIcon, 
  Filter, 
  MapPin, 
  Navigation,
  SlidersHorizontal,
  X
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import SkeletonCard from '@/components/ui/SkeletonCard'

// Import dynamique SSR-safe pour Leaflet
const MapView = dynamic(() => import('@/components/map/MapView'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-neutral-100 animate-pulse flex items-center justify-center text-neutral-400">
      <div className="text-center">
        <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Chargement de la carte...</p>
      </div>
    </div>
  )
})

// Toutes les catégories selon specs
const ALL_CATEGORIES = [
  { value: 'ALL', label: 'Toutes catégories' },
  { value: 'PHONE', label: 'Téléphones' },
  { value: 'IDENTITY_PAPERS', label: 'Papiers d\'identité' },
  { value: 'KEYS', label: 'Clés' },
  { value: 'LUGGAGE', label: 'Bagages' },
  { value: 'CLOTHING', label: 'Vêtements' },
  { value: 'WALLET', label: 'Portefeuilles' },
  { value: 'ELECTRONICS', label: 'Électronique' },
  { value: 'JEWELRY', label: 'Bijoux' },
  { value: 'BOOKS', label: 'Livres' },
  { value: 'PETS', label: 'Animaux' },
  { value: 'OTHER', label: 'Autre' },
]

// Villes selon specs
const ALL_CITIES = [
  { value: 'ALL', label: 'Toutes les villes' },
  { value: 'Lomé', label: 'Lomé' },
  { value: 'Kpalimé', label: 'Kpalimé' },
  { value: 'Sokodé', label: 'Sokodé' },
  { value: 'Atakpamé', label: 'Atakpamé' },
  { value: 'Kara', label: 'Kara' },
  { value: 'Dapaong', label: 'Dapaong' },
]

// Options de tri selon specs
const SORT_OPTIONS = [
  { value: 'RECENT', label: 'Plus récent' },
  { value: 'RELEVANCE', label: 'Pertinence' },
  { value: 'DISTANCE', label: 'Distance' },
  { value: 'MATCH_SCORE', label: 'Score de match' },
]

// Districts de Lomé pour autocomplete
const LOME_DISTRICTS = [
  'Adidogomé', 'Bè', 'Agoè', 'Tokoin', 'Nyékonakpoè', 
  'Kodjoviakopé', 'Hédzranawoé', 'Aflao', 'Djidjolé',
  'Avé', 'Gbégamey', 'Kpémé', 'Sanguéra'
]

export default function AnnoncesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [filterCity, setFilterCity] = useState('ALL')
  const [sortBy, setSortBy] = useState('RECENT')
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Simulation loading
  useState(() => {
    setTimeout(() => setIsLoading(false), 600)
  })

  // Filtrage et tri des items
  const filteredItems = useMemo(() => {
    let items = [...MOCK_ITEMS]

    // Filtre par recherche texte
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      items = items.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.location.district.toLowerCase().includes(query)
      )
    }

    // Filtre par type
    if (filterType !== 'ALL') {
      items = items.filter(item => item.type === filterType)
    }

    // Filtre par catégorie
    if (filterCategory !== 'ALL') {
      items = items.filter(item => item.category === filterCategory)
    }

    // Filtre par ville
    if (filterCity !== 'ALL') {
      items = items.filter(item => item.location.city === filterCity)
    }

    // Tri
    switch (sortBy) {
      case 'RECENT':
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'RELEVANCE':
        items.sort((a, b) => b.matchCount - a.matchCount)
        break
      case 'DISTANCE':
        if (userLocation) {
          items.sort((a, b) => {
            const distA = Math.sqrt(
              Math.pow(a.location.latitude - userLocation.lat, 2) + 
              Math.pow(a.location.longitude - userLocation.lng, 2)
            )
            const distB = Math.sqrt(
              Math.pow(b.location.latitude - userLocation.lat, 2) + 
              Math.pow(b.location.longitude - userLocation.lng, 2)
            )
            return distA - distB
          })
        }
        break
      case 'MATCH_SCORE':
        items.sort((a, b) => b.matchCount - a.matchCount)
        break
    }

    return items
  }, [searchQuery, filterType, filterCategory, filterCity, sortBy, userLocation])

  // Obtenir la position de l'utilisateur
  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => {
          // Position par défaut Lomé
          setUserLocation({ lat: 6.1375, lng: 1.2123 })
        }
      )
    } else {
      setUserLocation({ lat: 6.1375, lng: 1.2123 })
    }
  }

  // Réinitialiser les filtres
  const clearFilters = () => {
    setSearchQuery('')
    setFilterType('ALL')
    setFilterCategory('ALL')
    setFilterCity('ALL')
    setSortBy('RECENT')
  }

  const hasActiveFilters = filterType !== 'ALL' || filterCategory !== 'ALL' || filterCity !== 'ALL'

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
      {/* Filters Bar Premium */}
      <div className="border-b bg-white/90 backdrop-blur-xl p-4 sticky top-16 z-20 shadow-sm">
        <div className="container mx-auto space-y-4">
          {/* Search and main filters row */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Rechercher un objet (ex: iPhone, CNI, clés...)" 
                className="pl-12 h-14 bg-neutral-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
              <Select value={filterType} onValueChange={(v) => v && setFilterType(v)}>
                <SelectTrigger className="w-[140px] h-14 bg-neutral-50 border-none rounded-2xl font-semibold shrink-0">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="ALL">Tous</SelectItem>
                  <SelectItem value="LOST">Perdus</SelectItem>
                  <SelectItem value="FOUND">Trouvés</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCity} onValueChange={(v) => v && setFilterCity(v)}>
                <SelectTrigger className="w-[150px] h-14 bg-neutral-50 border-none rounded-2xl font-semibold shrink-0">
                  <SelectValue placeholder="Ville" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {ALL_CITIES.map(city => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => v && setSortBy(v)}>
                <SelectTrigger className="w-[160px] h-14 bg-neutral-50 border-none rounded-2xl font-semibold shrink-0">
                  <SelectValue placeholder="Trier" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {SORT_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Mobile filter toggle */}
              <Button 
                variant="outline" 
                className="md:hidden h-14 border-none bg-neutral-50 hover:bg-neutral-100 rounded-2xl px-4 shrink-0"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Extended filters (desktop) */}
          <AnimatePresence>
            {(showFilters || typeof window === 'undefined' || window.innerWidth >= 768) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-3 pt-2">
                  <Select value={filterCategory} onValueChange={(v) => v && setFilterCategory(v)}>
                    <SelectTrigger className="w-[200px] h-10 bg-neutral-50 border-none rounded-xl text-sm font-semibold">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl max-h-[300px]">
                      {ALL_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {hasActiveFilters && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="h-10 px-4 text-sm text-danger hover:text-danger hover:bg-danger/5 rounded-xl"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Réinitialiser
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Active filters badges */}
      {hasActiveFilters && (
        <div className="bg-white border-b px-4 py-2">
          <div className="container mx-auto flex flex-wrap gap-2">
            {filterType !== 'ALL' && (
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                Type: {filterType === 'LOST' ? 'Perdus' : 'Trouvés'}
                <button onClick={() => setFilterType('ALL')} className="ml-2 hover:text-danger">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filterCategory !== 'ALL' && (
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {ALL_CATEGORIES.find(c => c.value === filterCategory)?.label}
                <button onClick={() => setFilterCategory('ALL')} className="ml-2 hover:text-danger">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filterCity !== 'ALL' && (
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {filterCity}
                <button onClick={() => setFilterCity('ALL')} className="ml-2 hover:text-danger">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile View with Tabs */}
        <div className="md:hidden w-full flex flex-col">
          <Tabs defaultValue="list" className="flex-1 flex flex-col">
            <div className="bg-white border-b px-4">
              <TabsList className="w-full h-14 bg-transparent gap-4">
                <TabsTrigger value="list" className="flex-1 gap-2 rounded-xl data-[state=active]:bg-primary/5 data-[state=active]:text-primary font-bold">
                  <ListIcon className="h-5 w-5" /> Liste
                </TabsTrigger>
                <TabsTrigger value="map" className="flex-1 gap-2 rounded-xl data-[state=active]:bg-primary/5 data-[state=active]:text-primary font-bold">
                  <MapIcon className="h-5 w-5" /> Carte
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="list" className="flex-1 overflow-y-auto p-4 m-0 bg-neutral-50">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : filteredItems.length > 0 ? (
                <div className="space-y-4">
                  {filteredItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <AnnonceCard item={item} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </TabsContent>
            <TabsContent value="map" className="flex-1 m-0 relative">
              <MapView items={filteredItems} center={userLocation ? [userLocation.lat, userLocation.lng] : undefined} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop View Split */}
        <div className="hidden md:flex w-full">
          {/* Left Side: List */}
          <div className="w-[500px] lg:w-[600px] border-r border-neutral-100 bg-neutral-50 overflow-y-auto p-6 scrollbar-hide">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Fil d'annonces</h2>
                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mt-1">
                  {filteredItems.length} résultat{filteredItems.length > 1 ? 's' : ''}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGeolocate}
                className="gap-2 h-10 rounded-xl"
              >
                <Navigation className="h-4 w-4" />
                Près de moi
              </Button>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="space-y-4">
                {filteredItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <AnnonceCard item={item} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>

          {/* Right Side: Map */}
          <div className="flex-1 relative">
            <MapView items={filteredItems} center={userLocation ? [userLocation.lat, userLocation.lng] : undefined} />
            
            {/* Map floating controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <Button 
                size="lg" 
                onClick={handleGeolocate}
                className="bg-white/95 backdrop-blur-sm text-neutral-900 hover:bg-white shadow-lg border-none h-12 px-4 rounded-xl font-bold transition-all hover:scale-105"
              >
                <MapPin className="mr-2 h-4 w-4 text-primary" />
                Ma position
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-20 text-center px-4"
    >
      <div className="h-24 w-24 rounded-[2rem] bg-white shadow-sm flex items-center justify-center mx-auto mb-6">
        <Search className="h-10 w-10 text-neutral-200" />
      </div>
      <h3 className="text-xl font-bold text-neutral-900 mb-2">Aucun résultat</h3>
      <p className="text-neutral-500 font-medium max-w-[300px] mx-auto">
        Nous n'avons rien trouvé correspondant à vos critères. Essayez de modifier vos filtres.
      </p>
    </motion.div>
  )
}