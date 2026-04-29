// src/app/admin/moderation/page.tsx
"use client"

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchObjetsPage, changeObjetStatus, fetchAdminUnresolvedSignalements, resolveSignalement } from '@/lib/api'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdminButton from '@/components/admin/AdminButton'
import ChangeObjetStatusConfirmModal from '@/components/admin/ChangeObjetStatusConfirmModal'
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
import Breadcrumb from '@/components/layout/Breadcrumb'
import { motion } from 'framer-motion'

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tous', color: 'bg-muted' },
  { value: 'ACTIVE', label: 'Actives', color: 'bg-secondary' },
  { value: 'RESOLVED', label: 'Résolus', color: 'bg-accent' },
  { value: 'REPORTED', label: 'Signalées', color: 'bg-danger' },
  { value: 'CLOSED', label: 'Archivé', color: 'bg-border' },
]

export default function AdminModerationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [confirmStatusOpen, setConfirmStatusOpen] = useState(false)
  const [pendingStatusChange, setPendingStatusChange] = useState<{ itemId: number; status: 'ACTIVE' | 'RESOLVED' | 'CLOSED' } | null>(null)
  const [changingStatus, setChangingStatus] = useState(false)

  useEffect(() => {
    let mounted = true
    fetchObjetsPage({ page: 0, size: 100 })
      .then((p) => {
        if (!mounted) return
        setItems(p.items)
      })
      .catch(() => setItems([]))
    return () => {
      mounted = false
    }
  }, [])

  // If a ?selected=<id> param is provided, pre-select that item after items load.
  const searchParams = useSearchParams()
  useEffect(() => {
    const sel = searchParams?.get('selected')
    if (!sel) return
    const id = Number(sel)
    if (!Number.isNaN(id)) setSelectedItem(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, items])

  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({})
  const [reportedIds, setReportedIds] = useState<number[]>([])

  const setLoadingFor = useCallback((id: number, v: boolean) => {
    setActionLoading((s) => ({ ...s, [id]: v }))
  }, [])

  const handleChangeStatus = useCallback((id: number, newStatus: 'ACTIVE' | 'RESOLVED' | 'CLOSED') => {
    setPendingStatusChange({ itemId: id, status: newStatus })
    setConfirmStatusOpen(true)
  }, [])

  const confirmStatusChange = useCallback(async () => {
    if (!pendingStatusChange) return
    setChangingStatus(true)
    const { itemId, status: newStatus } = pendingStatusChange
    try {
      const updated = await changeObjetStatus(itemId, newStatus as any)
      setItems((prev) => prev.map((it) => (it.id === itemId ? updated : it)))
      setSelectedItem(itemId)
      toast.success('Statut mis à jour')

      // Resolve any open reports for this objet (admin action)
      try {
        const reports = await fetchAdminUnresolvedSignalements()
        const related = reports.filter((r) => r.objetId === itemId)
        if (related.length > 0) {
          await Promise.all(related.map((r) => resolveSignalement(r.id)))
          setReportedIds((prev) => prev.filter((x) => x !== itemId))
          toast.success('Signalements liés résolus')
        }
      } catch (err) {
        // Non-fatal: log and notify
        console.error('Failed to resolve related reports', err)
        toast.error('Erreur: impossible de marquer les signalements comme résolus')
      }
    } catch (err) {
      console.error('Failed to change status', err)
      toast.error('Erreur lors de la mise à jour du statut')
    } finally {
      setChangingStatus(false)
      setConfirmStatusOpen(false)
      setPendingStatusChange(null)
    }
  }, [pendingStatusChange])

  useEffect(() => {
    let mounted = true
    fetchAdminUnresolvedSignalements()
      .then((r) => {
        if (!mounted) return
        const ids = Array.from(new Set(r.map((x) => x.objetId)))
        setReportedIds(ids)
      })
      .catch(() => {})
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

    // Filter by real status coming from the backend
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'REPORTED') {
        filtered = filtered.filter((it) => reportedIds.includes(it.id))
      } else {
        filtered = filtered.filter((it) => it.status === statusFilter)
      }
    }

    return filtered
  }, [items, searchQuery, statusFilter])

  const stats = useMemo(() => {
    const counts = { active: 0, resolved: 0, closed: 0 }
    for (const it of items) {
      if (it.status === 'ACTIVE') counts.active++
      else if (it.status === 'RESOLVED') counts.resolved++
      else if (it.status === 'CLOSED') counts.closed++
    }
    return {
      active: counts.active,
      resolved: counts.resolved,
      closed: counts.closed,
      total: items.length,
    }
  }, [items])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <Breadcrumb items={[{ label: 'Administration', href: '/admin/dashboard' }, { label: 'Modération' }]} />
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Administration</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Modération</h1>
          </div>
          <div className="flex gap-2">
            <AdminButton variant="outline" className="gap-2">
              <Clock className="h-4 w-4" />
              Historique
            </AdminButton>
            <AdminButton className="bg-primary hover:bg-primary-dark gap-2">
              <Filter className="h-4 w-4" />
              Filtres avancés
            </AdminButton>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Actives', value: stats.active, icon: CheckCircle2, color: 'text-secondary', bg: 'bg-secondary/5' },
            { label: 'Résolues', value: stats.resolved, icon: ShieldCheck, color: 'text-accent', bg: 'bg-accent/5' },
            { label: 'Archivées', value: stats.closed, icon: XCircle, color: 'text-muted-foreground', bg: 'bg-muted' },
            { label: 'Total', value: stats.total, icon: Eye, color: 'text-muted-foreground', bg: 'bg-muted' },
          ].map((stat, i) => (
            <Card key={i} className="border border-border bg-card">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
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
        <Card className="border border-border mb-6 bg-card">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par titre, description ou utilisateur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-card border-none rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setStatusFilter(opt.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      statusFilter === opt.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-muted-foreground hover:bg-muted'
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
                      ? 'ring-2 ring-primary/20 border-primary'
                        : 'border-border hover:border-border'
                  } bg-card`}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="h-20 w-20 rounded-xl bg-muted shrink-0 overflow-hidden">
                        {item.images?.[0] ? (
                          <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Search className="h-6 w-6 text-muted-foreground" />
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
                              <span className="text-[10px] text-muted-foreground uppercase font-bold">{item.category}</span>
                            </div>
                            <h3 className="font-bold text-foreground truncate">{item.title}</h3>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                        <AdminButton size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg">
                          <Eye className="h-4 w-4" />
                        </AdminButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {itemsToModerate.length === 0 && (
              <Card className="border-dashed bg-card">
                  <CardContent className="py-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-bold text-foreground">Aucun résultat</h3>
                    <p className="text-sm text-muted-foreground">Aucune annonce ne correspond à vos critères.</p>
                  </CardContent>
                </Card>
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 border border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Détails de l'annonce</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedItem ? (
                  <>
                    {/* Preview */}
                    <div className="aspect-video rounded-xl bg-muted overflow-hidden">
                      {items.find(i => i.id === selectedItem)?.images?.[0] ? (
                        <img 
                          src={items.find(i => i.id === selectedItem)?.images?.[0]} 
                          alt="Preview" 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Search className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">
                          {items.find(i => i.id === selectedItem)?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {items.find(i => i.id === selectedItem)?.description?.slice(0, 150)}...
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold">Type</p>
                          <p className="font-semibold">
                            {items.find(i => i.id === selectedItem)?.type === 'LOST' ? 'Perdu' : 'Trouvé'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold">Catégorie</p>
                          <p className="font-semibold">
                            {items.find(i => i.id === selectedItem)?.category}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold">Lieu</p>
                          <p className="font-semibold">
                            {items.find(i => i.id === selectedItem)?.location?.district}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold">Utilisateur</p>
                          <p className="font-semibold">
                            {items.find(i => i.id === selectedItem)?.user?.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                      <AdminButton
                        className="flex-1 bg-secondary hover:bg-secondary-dark gap-2"
                        onClick={() => selectedItem && handleChangeStatus(selectedItem, 'ACTIVE')}
                        disabled={selectedItem ? !!actionLoading[selectedItem] : false}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {selectedItem && actionLoading[selectedItem] ? '...' : 'Approuver'}
                      </AdminButton>
                      <AdminButton
                        variant="outline"
                        className="flex-1 text-danger border-danger hover:bg-danger/5 gap-2"
                        onClick={() => selectedItem && handleChangeStatus(selectedItem, 'CLOSED')}
                        disabled={selectedItem ? !!actionLoading[selectedItem] : false}
                      >
                        <XCircle className="h-4 w-4" />
                        {selectedItem && actionLoading[selectedItem] ? '...' : 'Rejeter'}
                      </AdminButton>
                    </div>

                    <AdminButton variant="ghost" className="w-full text-muted-foreground gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Signaler pour examen
                    </AdminButton>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Sélectionnez une annonce pour voir les détails</p>
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