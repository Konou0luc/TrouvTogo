// src/components/annonce/RewardBadge.tsx
import { Badge } from '@/components/ui/badge'
import { Gift } from 'lucide-react'

export default function RewardBadge({ reward }: { reward: string }) {
  return (
    <Badge className="flex items-center gap-1 border-none bg-accent text-white">
      <Gift className="h-3 w-3" />
      {reward}
    </Badge>
  )
}
