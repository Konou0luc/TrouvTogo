import type {
  Item,
  ItemCategory,
  ItemStatus,
  ItemType,
  UserPublic,
} from '@/types'
import type { BackendObjet } from '@/lib/backend-types'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1695643875095-f5620748605d?w=800&auto=format&fit=crop'

const CATEGORIES: ItemCategory[] = [
  'ELECTRONICS',
  'IDENTITY_PAPERS',
  'KEYS',
  'LUGGAGE',
  'CLOTHING',
  'WALLET',
  'PHONE',
  'JEWELRY',
  'BOOKS',
  'PETS',
  'OTHER',
]

function toItemCategory(nom: string | null | undefined): ItemCategory {
  if (nom && CATEGORIES.includes(nom as ItemCategory)) {
    return nom as ItemCategory
  }
  return 'OTHER'
}

function toItemType(t: BackendObjet['type']): ItemType {
  return t === 'PERDU' ? 'LOST' : 'FOUND'
}

function toItemStatus(s: BackendObjet['statut']): ItemStatus {
  switch (s) {
    case 'ACTIF':
      return 'ACTIVE'
    case 'RESOLU':
      return 'RESOLVED'
    case 'ARCHIVE':
      return 'CLOSED'
    default:
      return 'ACTIVE'
  }
}

function parseLocation(localisation: string | null, cityFallback: string) {
  if (!localisation || !localisation.trim()) {
    return {
      address: '',
      city: cityFallback,
      district: '',
      latitude: 0,
      longitude: 0,
    }
  }
  const parts = localisation.split(',').map((p) => p.trim())
  const district = parts[0] ?? ''
  const city = parts[1] ?? cityFallback
  return {
    address: localisation,
    city,
    district,
    latitude: 0,
    longitude: 0,
  }
}

export function backendObjetToItem(o: BackendObjet, reward: string | null = null): Item {
  const category = toItemCategory(o.categorieNom)
  const images =
    o.photosUrls && o.photosUrls.length > 0 ? o.photosUrls : [FALLBACK_IMAGE]

  const userPublic: UserPublic = {
    id: o.proprietaireId,
    name: o.proprietaireUsername,
    avatar: null,
    city: parseLocation(o.localisation, 'Lomé').city,
    joinDate: o.createdAt,
    reputationScore: 0,
  }

  return {
    id: o.id,
    categoryId: o.categorieId,
    categoryDisplayName: o.categorieDescription ?? o.categorieNom,
    type: toItemType(o.type),
    category,
    title: o.titre,
    description: o.description ?? '',
    location: parseLocation(o.localisation, 'Lomé'),
    depositLocation: null,
    date: o.dateEvenement ?? o.createdAt,
    images,
    status: toItemStatus(o.statut),
    userId: o.proprietaireId,
    user: userPublic,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    resolvedAt: o.statut === 'RESOLU' ? o.updatedAt : null,
    reward,
    matchCount: 0,
  }
}

export function itemTypeToBackend(t: ItemType): 'PERDU' | 'TROUVE' {
  return t === 'LOST' ? 'PERDU' : 'TROUVE'
}
