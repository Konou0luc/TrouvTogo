"use client"

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import AdminButton from '@/components/admin/AdminButton'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { PlusCircle, Edit, Trash, Loader2, Search as SearchIcon, Eye } from 'lucide-react'
import { fetchCategories, createCategory, updateCategory, deleteCategory, fetchObjetsPage } from '@/lib/api'
import type { BackendCategorie } from '@/lib/backend-types'
import { toast } from 'sonner'
import CategoryDetailsModal from '@/components/admin/CategoryDetailsModal'
import Breadcrumb from '@/components/layout/Breadcrumb'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<BackendCategorie[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<BackendCategorie | null>(null)
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [detailsCategory, setDetailsCategory] = useState<BackendCategorie | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const cats = await fetchCategories()
      setCategories(cats)
    } catch (err) {
      toast.error('Impossible de charger les catégories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setNom('')
    setDescription('')
    setIsOpen(true)
  }

  const openEdit = (c: BackendCategorie) => {
    setEditing(c)
    setNom(c.nom)
    setDescription(c.description ?? '')
    setIsOpen(true)
  }

  const openDetails = (c: BackendCategorie) => {
    setDetailsCategory(c)
    setDetailsOpen(true)
  }

  const handleSave = async () => {
    if (!nom.trim()) {
      toast.error('Le nom est requis')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await updateCategory(editing.id, { nom: nom.trim(), description })
        toast.success('Catégorie modifiée')
      } else {
        await createCategory({ nom: nom.trim(), description })
        toast.success('Catégorie créée')
      }
      setIsOpen(false)
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (c: BackendCategorie) => {
    if (!confirm(`Supprimer la catégorie "${c.nom}" ?`)) return
    try {
      await deleteCategory(c.id)
      toast.success('Catégorie supprimée')
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-[88rem] px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
        <Breadcrumb items={[{ label: 'Administration', href: '/admin/dashboard' }, { label: 'Catégories' }]} />
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des catégories</h1>
            <p className="text-sm text-muted-foreground">Créer, modifier et supprimer les catégories visibles sur le site.</p>
          </div>
          <div className="flex gap-2">
            <AdminButton className="gap-2" onClick={openCreate}>
              <PlusCircle className="h-4 w-4" />
              Nouvelle catégorie
            </AdminButton>
          </div>
        </div>

        <Card className="border border-neutral-200">
          <CardContent>
            {loading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="w-full">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }} placeholder="Rechercher une catégorie..." className="pl-10 h-10" />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-neutral-500">Afficher</label>
                    <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1) }} className="h-10 rounded-md border px-3">
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-separate" style={{ borderSpacing: '0 8px' }}>
                    <thead>
                      <tr className="text-left text-sm text-muted-foreground">
                        <th className="px-4 py-2">Nom</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/** client-side filter + pagination */}
                      {(() => {
                        const q = search.trim().toLowerCase()
                        const filtered = categories.filter(c => {
                          if (!q) return true
                          return c.nom.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q)
                        })
                        const total = filtered.length
                        const pages = Math.max(1, Math.ceil(total / perPage))
                        const start = (currentPage - 1) * perPage
                        const pageData = filtered.slice(start, start + perPage)

                        return (
                          <>
                            {pageData.map((c) => (
                              <tr key={c.id} className="bg-card hover:shadow-sm rounded-md">
                                <td className="py-3 pr-4 align-top font-semibold">{c.nom}</td>
                                <td className="py-3 pr-4 text-sm text-muted-foreground align-top">{c.description ?? '—'}</td>
                                <td className="py-3 text-right align-top">
                                  <div className="inline-flex gap-2 items-center justify-end">
                                    <AdminButton variant="ghost" size="sm" onClick={() => openDetails(c)} aria-label={`Voir détails ${c.nom}`}>
                                      <Eye className="h-4 w-4" />
                                    </AdminButton>
                                    <AdminButton variant="outline" size="sm" onClick={() => openEdit(c)}>
                                      <Edit className="h-4 w-4" />
                                    </AdminButton>
                                    <AdminButton variant="destructive" size="sm" onClick={() => handleDelete(c)}>
                                      <Trash className="h-4 w-4" />
                                    </AdminButton>
                                  </div>
                                </td>
                              </tr>
                            ))}

                            {/* Pagination footer */}
                            <tr>
                              <td colSpan={3} className="pt-4">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm text-neutral-500">{`Affichage ${Math.min(start+1, total)}-${Math.min(start+perPage, total)} de ${total}`}</div>
                                  <div className="flex items-center gap-2">
                                    <AdminButton variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Préc.</AdminButton>
                                    <div className="flex items-center gap-1">
                                      {Array.from({ length: pages }).map((_, i) => (
                                        <button key={i} onClick={() => setCurrentPage(i+1)} className={`px-3 py-1 rounded-md ${currentPage === i+1 ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-700'}`}>
                                          {i+1}
                                        </button>
                                      ))}
                                    </div>
                                    <AdminButton variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(pages, p + 1))} disabled={currentPage === pages}>Suiv.</AdminButton>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </>
                        )
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <CategoryDetailsModal open={detailsOpen} category={detailsCategory} onOpenChange={setDetailsOpen} onEdit={(c) => { setIsOpen(true); setEditing(c); setDetailsOpen(false) }} onDelete={async (c) => { setDetailsOpen(false); await handleDelete(c) }} />

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</DialogTitle>
              <DialogDescription>{editing ? `Modifier ${editing?.nom ?? ''}` : 'Créez une nouvelle catégorie'}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <Input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom (ex: Téléphones)" />
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optionnel)" />
            </div>

            <DialogFooter>
              <AdminButton variant="outline" onClick={() => setIsOpen(false)}>Annuler</AdminButton>
              <AdminButton onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : editing ? 'Sauvegarder' : 'Créer'}</AdminButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
