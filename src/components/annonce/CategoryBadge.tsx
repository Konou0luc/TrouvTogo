// src/components/annonce/CategoryBadge.tsx
import { ItemCategory } from '@/types'
import { Badge } from '@/components/ui/badge'
import { 
  Laptop, 
  CreditCard, 
  Key, 
  Briefcase, 
  Shirt, 
  Wallet, 
  Smartphone, 
  Gem, 
  BookOpen, 
  PawPrint, 
  Package 
} from 'lucide-react'

const categoryConfig: Record<ItemCategory, { label: string, icon: any }> = {
  ELECTRONICS: { label: 'Électronique', icon: Laptop },
  IDENTITY_PAPERS: { label: 'Papiers', icon: CreditCard },
  KEYS: { label: 'Clés', icon: Key },
  LUGGAGE: { label: 'Bagages', icon: Briefcase },
  CLOTHING: { label: 'Vêtements', icon: Shirt },
  WALLET: { label: 'Portefeuille', icon: Wallet },
  PHONE: { label: 'Téléphone', icon: Smartphone },
  JEWELRY: { label: 'Bijoux', icon: Gem },
  BOOKS: { label: 'Livres', icon: BookOpen },
  PETS: { label: 'Animaux', icon: PawPrint },
  OTHER: { label: 'Autre', icon: Package },
}

export default function CategoryBadge({ category }: { category: ItemCategory }) {
  const config = categoryConfig[category]
  const Icon = config.icon

  return (
    <Badge variant="secondary" className="flex items-center gap-1 font-normal bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border-none">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}
