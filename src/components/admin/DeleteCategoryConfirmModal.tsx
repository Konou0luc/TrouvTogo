'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import AdminButton from '@/components/admin/AdminButton'
import type { BackendCategorie } from '@/lib/backend-types'

interface Props {
  open: boolean
  category: BackendCategorie | null
  onOpenChange: (v: boolean) => void
  onConfirm: () => void
  loading?: boolean
}

export default function DeleteCategoryConfirmModal({ open, category, onOpenChange, onConfirm, loading = false }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer la catégorie</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer la catégorie "{category?.nom}" ?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Cette action est irréversible.</p>
        </div>

        <DialogFooter>
          <AdminButton variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annuler
          </AdminButton>
          <AdminButton variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? 'Suppression...' : 'Supprimer'}
          </AdminButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
