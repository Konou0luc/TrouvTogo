// src/app/admin/moderation/page.tsx
"use client"

import { useState, useMemo, useEffect } from 'react'
import { fetchObjetsPage } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Clock,
  Eye,
  User,
  MapPin,
  Calendar
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { motion } from 'framer-motion'

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tous', color: 'bg-neutral-500' },
  { value: 'ACTIVE', label: 'Actives', color: 'bg-secondary' },
  { value: 'PENDING', label: 'En attente', color: 'bg-accent' },
  { value: 'REPORTED', label: 'Signalées', color: 'bg-danger' },
]

export default function AdminModerationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    fetchObjetsPage({ page: 0, size: 50 })
      .then((p) => {
        if (!mounted) return
        setItems(p.items)
      })
      .catch(() => setItems([]))
    return () => {
      mounted = false
    }
  }, [])

  // Filter items for moderation
  const itemsToModerate = useMemo(() => {
    let filtered = [...items]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        (item.title || '').toLowerCase().includes(query) ||
        (item.description || '').toLowerCase().includes(query) ||
        (item.user?.name || '').toLowerCase().includes(query)
      )
    }

    // For demo, simulate some items as "pending" or "reported"
    if (statusFilter === 'PENDING') {
      filtered = filtered.slice(0, 3)
    } else if (statusFilter === 'REPORTED') {
      filtered = filtered.slice(3, 5)
    }

    return filtered
  }, [items, searchQuery, statusFilter])

  const stats = {
    pending: 8,
    reported: 3,
    approved: 156,
    rejected: 12,
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Administration</span>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900">Modération</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Clock className="h-4 w-4" />
              Historique
            </Button>
            <Button className="bg-primary hover:bg-primary-dark gap-2">
              <Filter className="h-4 w-4" />
              Filtres avancés
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'En attente', value: stats.pending, icon: Clock, color: 'text-accent', bg: 'bg-accent/5' },
            { label: 'Signalées', value: stats.reported, icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger/5' },
            { label: 'Approuvées', value: stats.approved, icon: CheckCircle2, color: 'text-secondary', bg: 'bg-secondary/5' },
            { label: 'Rejetées', value: stats.rejected, icon: XCircle, color: 'text-neutral-500', bg: 'bg-neutral-100' },
          ].map((stat, i) => (
            <Card key={i} className="border border-neutral-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border border-neutral-200 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Rechercher par titre, description ou utilisateur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-neutral-50 border-none rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setStatusFilter(opt.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      statusFilter === opt.value
                        ? 'bg-primary text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    <div className={`h-2 w-2 rounded-full ${opt.color}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items List */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-2 space-y-4">
            {itemsToModerate.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedItem(item.id)}
              >
                <Card className={`border transition-all cursor-pointer ${
                  selectedItem === item.id 
                    ? 'border-primary' 
                    : 'border-neutral-100 hover:border-neutral-200'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="h-20 w-20 rounded-xl bg-neutral-100 shrink-0 overflow-hidden">
                        {item.images?.[0] ? (
                          <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Search className="h-6 w-6 text-neutral-300" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={item.type === 'LOST' ? 'bg-danger/10 text-danger text-xs' : 'bg-secondary/10 text-secondary text-xs'}>
                                {item.type === 'LOST' ? 'Perdu' : 'Trouvé'}
                              </Badge>
                              <span className="text-[10px] text-neutral-400 uppercase font-bold">{item.category}</span>
                            </div>
                            <h3 className="font-bold text-neutral-900 truncate">{item.title}</h3>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-neutral-500">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{item.user.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{item.location.district}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(item.createdAt), 'dd/MM', { locale: fr })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 shrink-0">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {itemsToModerate.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <Search className="h-12 w-12 text-neutral-200 mx-auto mb-4" />
                  <h3 className="font-bold text-neutral-900">Aucun résultat</h3>
                  <p className="text-sm text-neutral-500">Aucune annonce ne correspond à vos critères.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 border border-neutral-200">
              <CardHeader>
                <CardTitle className="text-lg">Détails de l'annonce</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedItem ? (
                  <>
                    {/* Preview */}
                    <div className="aspect-video rounded-xl bg-neutral-100 overflow-hidden">
                      {items.find(i => i.id === selectedItem)?.images?.[0] ? (
                        <img 
                          src={items.find(i => i.id === selectedItem)?.images?.[0]} 
                          alt="Preview" 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Search className="h-12 w-12 text-neutral-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-lg text-neutral-900">
                          {items.find(i => i.id === selectedItem)?.title}
                        </h3>
                        <p className="text-sm text-neutral-500 mt-1">
                          {items.find(i => i.id === selectedItem)?.description?.slice(0, 150)}...
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-neutral-400 uppercase font-bold">Type</p>
                          <p className="font-semibold">
                            {items.find(i => i.id === selectedItem)?.type === 'LOST' ? 'Perdu' : 'Trouvé'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-400 uppercase font-bold">Catégorie</p>
                          <p className="font-semibold">
                            {items.find(i => i.id === selectedItem)?.category}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-400 uppercase font-bold">Lieu</p>
                          <p className="font-semibold">
                            {items.find(i => i.id === selectedItem)?.location?.district}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-400 uppercase font-bold">Utilisateur</p>
                          <p className="font-semibold">
                            {items.find(i => i.id === selectedItem)?.user?.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button className="flex-1 bg-secondary hover:bg-secondary-dark gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Approuver
                      </Button>
                      <Button variant="outline" className="flex-1 text-danger border-danger hover:bg-danger/5 gap-2">
                        <XCircle className="h-4 w-4" />
                        Rejeter
                      </Button>
                    </div>

                    <Button variant="ghost" className="w-full text-neutral-500 gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Signaler pour examen
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Eye className="h-12 w-12 text-neutral-200 mx-auto mb-4" />
                    <p className="text-neutral-500 font-medium">Sélectionnez une annonce pour voir les détails</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}