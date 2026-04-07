// src/components/annonce/RewardBadge.tsx
import { Badge } from '@/components/ui/badge'
import { Gift } from 'lucide-react'

export default function RewardBadge({ reward }: { reward: string }) {
  return (
    <Badge className="bg-accent text-white border-none flex items-center gap-1 shadow-sm">
      <Gift className="h-3 w-3" />
      {reward}
    </Badge>
  )
}
