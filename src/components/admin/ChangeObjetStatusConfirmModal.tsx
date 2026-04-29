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
  action: 'ACTIVE' | 'RESOLVED' | 'CLOSED'
  itemTitle?: string
}

const actionMessages = {
  'ACTIVE': { title: 'Marquer comme active', desc: 'Êtes-vous sûr de vouloir marquer cette annonce comme active ?' },
  'RESOLVED': { title: 'Marquer comme résolue', desc: 'Êtes-vous sûr de vouloir marquer cette annonce comme résolue ?' },
  'CLOSED': { title: 'Archiver', desc: 'Êtes-vous sûr de vouloir archiver cette annonce ?' },
}

export default function ChangeObjetStatusConfirmModal({ open, onOpenChange, onConfirm, loading = false, action, itemTitle = '' }: Props) {
  const msg = actionMessages[action]
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{msg.title}</DialogTitle>
          <DialogDescription>
            {msg.desc}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm text-muted-foreground">
          {itemTitle && <p>Annonce : <span className="font-medium text-foreground">{itemTitle}</span></p>}
          {action === 'CLOSED' && <p className="text-amber-600">⚠️ Les annonces archivées ne seront plus visibles.</p>}
        </div>

        <DialogFooter>
          <AdminButton variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annuler
          </AdminButton>
          <AdminButton onClick={onConfirm} disabled={loading}>
            {loading ? 'Changement en cours...' : 'Confirmer'}
          </AdminButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
