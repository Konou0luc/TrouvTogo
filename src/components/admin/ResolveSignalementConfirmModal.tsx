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

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: () => void
  loading?: boolean
  titre?: string
}

export default function ResolveSignalementConfirmModal({ open, onOpenChange, onConfirm, loading = false, titre = '' }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Résoudre le signalement</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir marquer ce signalement comme résolu ?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm text-muted-foreground">
          {titre && <p>Annonce : <span className="font-medium text-foreground">{titre}</span></p>}
          <p>Cette action est irréversible.</p>
        </div>

        <DialogFooter>
          <AdminButton variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annuler
          </AdminButton>
          <AdminButton onClick={onConfirm} disabled={loading}>
            {loading ? 'Résolution en cours...' : 'Résoudre'}
          </AdminButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
