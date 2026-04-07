// src/components/annonce/StatusBadge.tsx
import { ItemStatus } from '@/types'
import { Badge } from '@/components/ui/badge'

export default function StatusBadge({ status }: { status: ItemStatus }) {
  const statusConfig: Record<ItemStatus, { label: string, className: string }> = {
    ACTIVE: { label: 'Actif', className: 'bg-primary/10 text-primary border-primary/20' },
    RESOLVED: { label: 'Résolu', className: 'bg-secondary/10 text-secondary border-secondary/20' },
    CLOSED: { label: 'Fermé', className: 'bg-neutral-100 text-neutral-500 border-neutral-200' },
    EXPIRED: { label: 'Expiré', className: 'bg-danger/10 text-danger border-danger/20' },
  }

  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={`font-medium ${config.className}`}>
      {config.label}
    </Badge>
  )
}
