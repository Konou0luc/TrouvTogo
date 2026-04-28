// src/app/(app)/mes-annonces/page.tsx
'use client'

import { useState, useMemo, useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { fetchMesObjets } from '@/lib/api'
import AnnonceCard from '@/components/annonce/AnnonceCard'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  PlusCircle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Search,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import SkeletonCard from '@/components/ui/SkeletonCard'

const STATUS_FILTERS = [
  { value: 'ALL', label: 'Tous', icon: FileText },
  { value: 'ACTIVE', label: 'Actives', icon: Clock },
  { value: 'RESOLVED', label: 'Résolus', icon: CheckCircle2 },
  { value: 'EXPIRED', label: 'Expirés', icon: XCircle },
]

export default function MesAnnoncesPage() {
  const { user } = useAppStore()
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    let mounted = true
    setIsLoading(true)
    fetchMesObjets()
      .then((res) => {
        if (!mounted) return
        setItems(res)
      })
      .catch(() => setItems([]))
      .finally(() => setIsLoading(false))
    return () => {
      mounted = false
    }
  }, [user])

  // Filtrer les items de l'utilisateur (données chargées depuis l'API)
  const myItems = useMemo(() => {
    if (!user) return []

    let filtered = items.filter((item) => item.userId === user.id)

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    if (typeFilter !== 'ALL') {
      filtered = filtered.filter((item) => item.type === typeFilter)
    }

    return filtered
  }, [user, items, searchQuery, statusFilter, typeFilter])

  // Stats
  const stats = useMemo(() => ({
    total: items.filter((i) => i.userId === user?.id).length,
    active: items.filter((i) => i.userId === user?.id && i.status === 'ACTIVE').length,
    resolved: items.filter((i) => i.userId === user?.id && i.status === 'RESOLVED').length,
  }), [user, items])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Veuillez vous connecter</h1>
        <Link href="/login">
          <Button>Se connecter</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <FileText className="h-8 w-8 text-foreground" />
              Mes annonces
            </h1>
            <p className="text-foreground mt-1">Gérez vos signalements d'objets perdus et trouvés.</p>
          </div>
          <Link href="/declarer/perdu">
            <Button className="bg-primary hover:bg-primary-dark font-bold h-12 px-6 rounded-xl gap-2">
              <PlusCircle className="h-5 w-5" />
              Nouvelle annonce
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'text-primary' },
            { label: 'Actives', value: stats.active, color: 'text-accent' },
            { label: 'Résolues', value: stats.resolved, color: 'text-secondary' },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl p-6 bg-card border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color} text-foreground`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-xl border border-border bg-card p-4">
          <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher dans mes annonces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-popover border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
                <SelectTrigger className="w-[160px] h-12 bg-popover border-none rounded-xl font-semibold">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {STATUS_FILTERS.map(f => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={(v) => v && setTypeFilter(v)}>
                <SelectTrigger className="w-[140px] h-12 bg-popover border-none rounded-xl font-semibold">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ALL">Tous</SelectItem>
                  <SelectItem value="LOST">Perdus</SelectItem>
                  <SelectItem value="FOUND">Trouvés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  statusFilter === f.value 
                    ? 'bg-primary text-white' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <f.icon className="h-4 w-4" />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : myItems.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myItems.map((item, idx) => (
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
          <div className="bg-card rounded-3xl p-20 text-center border border-border">
            <div className="h-20 w-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-neutral-300" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Aucune annonce</h3>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? "Aucune annonce ne correspond à votre recherche."
                : "Vous n'avez pas encore d'annonces. Commencez par en créer une !"
              }
            </p>
            {!searchQuery && (
              <Link href="/declarer/perdu">
                <Button className="font-bold h-12 px-8 rounded-xl">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Créer ma première annonce
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}