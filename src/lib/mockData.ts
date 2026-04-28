// src/lib/mockData.ts
import { Item, PublicStats, ItemCategory, ItemType, MatchResult, Conversation, Message, Notification } from '@/types'

export const LOME_DISTRICTS = {
  'Bè':           { lat: 6.1279, lng: 1.2201 },
  'Adidogomé':    { lat: 6.1614, lng: 1.1814 },
  'Agoè':         { lat: 6.1917, lng: 1.2103 },
  'Tokoin':       { lat: 6.1456, lng: 1.2367 },
  'Nyékonakpoè':  { lat: 6.1389, lng: 1.2289 },
  'Kodjoviakopé': { lat: 6.1321, lng: 1.2089 },
  'Hédzranawoé':  { lat: 6.1512, lng: 1.1956 },
  'Djidjolé':     { lat: 6.1678, lng: 1.2234 },
}

// Legacy mock stats — kept empty for now to avoid default data leaking into the UI.
export const MOCK_STATS: PublicStats = {
  totalItems: 0,
  resolvedItems: 0,
  successRate: 0,
  activeUsers: 0,
  topCategories: [],
  averageMatchScore: 0,
}

// Visuels à dominante ouest-africaine / africaine (Unsplash — hotlinks stables pour next/image).
// Pour des assets maison ou Freepik, remplacer par des fichiers dans /public et des chemins relatifs.
const itemImages: Record<ItemCategory, string[]> = {
  PHONE: [
    'https://images.unsplash.com/photo-1639080494293-a6c409e3bb88?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1758874384553-b99bae0db3c8?w=800&auto=format&fit=crop',
  ],
  IDENTITY_PAPERS: [
    'https://images.unsplash.com/photo-1566996533071-2c578080c06e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1759430954379-81c2c1d908ee?w=800&auto=format&fit=crop',
  ],
  KEYS: [
    'https://images.unsplash.com/photo-1609587415882-97552f39c6c2?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1734868419408-5dcf1cbe02a7?w=800&auto=format&fit=crop',
  ],
  LUGGAGE: [
    'https://images.unsplash.com/photo-1532968899863-5b52ef155913?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&auto=format&fit=crop',
  ],
  WALLET: [
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1765584829997-12ab011bb5b3?w=800&auto=format&fit=crop',
  ],
  ELECTRONICS: [
    'https://images.unsplash.com/photo-1449247613801-ab06418e2861?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620829813573-7c9e1877706f?w=800&auto=format&fit=crop',
  ],
  JEWELRY: [
    'https://images.unsplash.com/photo-1574362098421-38623a3466b5?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=800&auto=format&fit=crop',
  ],
  CLOTHING: [
    'https://images.unsplash.com/photo-1734868032501-448d1457dc38?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1773398972684-2ba88aa89499?w=800&auto=format&fit=crop',
  ],
  PETS: [
    'https://images.unsplash.com/photo-1753685722939-6bda713c298d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1633935280513-b298ced80f9b?w=800&auto=format&fit=crop',
  ],
  BOOKS: [
    'https://images.unsplash.com/photo-1576089275954-40cd98bfcfdb?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop',
  ],
  OTHER: [
    'https://images.unsplash.com/photo-1695643875095-f5620748605d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1734255287995-7c09dbc99613?w=800&auto=format&fit=crop',
  ],
}

const userAvatars = [
  'https://images.unsplash.com/photo-1559783684-874488c5f42f?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1562173650-f61426fbe683?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1564541558234-ef406c118d0c?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1559670057-fa7b45a1c253?w=200&auto=format&fit=crop',
]

const createMockItem = (id: number, type: ItemType, category: ItemCategory, title: string, district: keyof typeof LOME_DISTRICTS): Item => ({
  id,
  type,
  category,
  title,
  description: `Objet ${type === 'LOST' ? 'perdu' : 'trouvé'} à ${district}. Détails visibles sur la photo. Merci de contacter pour plus d'informations.`,
  location: {
    address: `${district}, Lomé`,
    city: 'Lomé',
    district,
    latitude: LOME_DISTRICTS[district].lat + (Math.random() - 0.5) * 0.01,
    longitude: LOME_DISTRICTS[district].lng + (Math.random() - 0.5) * 0.01,
  },
  depositLocation: type === 'FOUND' ? 'Commissariat central' : null,
  date: new Date(2026, 3, 1 + (id % 28)).toISOString(),
  images: [itemImages[category][id % itemImages[category].length]],
  status: 'ACTIVE',
  userId: 1,
  user: {
    id: 1,
    name: ['Koffi Mensah', 'Ama Togo', 'Jean-Pierre L.', 'Akpéné G.'][id % 4],
    avatar: userAvatars[id % userAvatars.length],
    city: 'Lomé',
    joinDate: '2024-01-01',
    reputationScore: 90 + (id % 10),
  },
  createdAt: new Date(2026, 3, 1).toISOString(),
  updatedAt: new Date(2026, 3, 1).toISOString(),
  resolvedAt: null,
  reward: type === 'LOST' ? '5000 FCFA' : null,
  matchCount: id % 5,
})

// Empty array to ensure no default items are displayed in the UI.
export const MOCK_ITEMS: Item[] = []

export const MOCK_MATCHES: MatchResult[] = []

export const MOCK_CONVERSATIONS: Conversation[] = []

export const MOCK_MESSAGES: Message[] = []

export const MOCK_NOTIFICATIONS: Notification[] = []
