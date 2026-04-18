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

export default function CategoryBadge({
  category,
  label,
}: {
  category: ItemCategory
  /** Libellé depuis l’API (référentiel catégories) ; sinon libellé enum */
  label?: string | null
}) {
  const config = categoryConfig[category] ?? categoryConfig.OTHER
  const Icon = config.icon
  const text = label?.trim() || config.label

  return (
    <Badge
      variant="secondary"
      className="flex items-center gap-1 border-none bg-neutral-100 font-normal text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
    >
      <Icon className="h-3 w-3" />
      {text}
    </Badge>
  )
}
