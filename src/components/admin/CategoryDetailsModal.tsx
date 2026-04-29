"use client"

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import AdminButton from '@/components/admin/AdminButton'
import { fetchObjetsPage } from '@/lib/api'
import type { BackendCategorie } from '@/lib/backend-types'

interface Props {
  open: boolean
  category: BackendCategorie | null
  onOpenChange: (v: boolean) => void
  onEdit: (c: BackendCategorie) => void
  onDelete: (c: BackendCategorie) => void
}

export default function CategoryDetailsModal({ open, category, onOpenChange, onEdit, onDelete }: Props) {
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    async function loadCount() {
      if (!category) return
      setLoading(true)
      try {
        const res = await fetchObjetsPage({ page: 0, size: 1, categorieId: category.id })
        if (!mounted) return
        setCount(res.pagination.total)
      } catch (e) {
        if (!mounted) return
        setCount(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (open) loadCount()
    return () => {
      mounted = false
    }
  }, [open, category])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails de la catégorie</DialogTitle>
          <DialogDescription>Informations et actions pour la catégorie sélectionnée.</DialogDescription>
        </DialogHeader>

        {category ? (
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400 uppercase font-bold">Nom</p>
                <p className="font-semibold text-lg">{category.nom}</p>
              </div>
              <div>
                <Badge className="uppercase">ID {category.id}</Badge>
              </div>
            </div>

            <div>
              <p className="text-sm text-neutral-400 uppercase font-bold">Description</p>
              <p className="text-sm text-neutral-700">{category.description ?? '—'}</p>
            </div>

            <div>
              <p className="text-sm text-neutral-400 uppercase font-bold">Nombre d'annonces</p>
              <p className="text-lg font-semibold">{loading ? 'Chargement...' : count ?? '—'}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <AdminButton className="flex-1" onClick={() => category && onEdit(category)}>Modifier</AdminButton>
              <AdminButton variant="destructive" className="flex-1" onClick={() => category && onDelete(category)}>Supprimer</AdminButton>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-neutral-500">Aucune catégorie sélectionnée.</div>
        )}

        <DialogFooter>
          <AdminButton variant="outline" onClick={() => onOpenChange(false)}>Fermer</AdminButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
