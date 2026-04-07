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

export const MOCK_STATS: PublicStats = {
  totalItems: 1250,
  resolvedItems: 840,
  successRate: 67.2,
  activeUsers: 3500,
  topCategories: [
    { category: 'PHONE', count: 450 },
    { category: 'IDENTITY_PAPERS', count: 320 },
    { category: 'KEYS', count: 180 },
    { category: 'WALLET', count: 120 },
  ],
  averageMatchScore: 72,
}

// Images Unsplash réelles et stables pour un look professionnel
const itemImages: Record<ItemCategory, string[]> = {
  PHONE: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop'
  ],
  IDENTITY_PAPERS: [
    'https://images.unsplash.com/photo-1586762522614-5c4673b8f85b?w=800&auto=format&fit=crop'
  ],
  KEYS: [
    'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop'
  ],
  LUGGAGE: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop'
  ],
  WALLET: [
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop'
  ],
  ELECTRONICS: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop'
  ],
  JEWELRY: [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop'
  ],
  CLOTHING: [
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop'
  ],
  PETS: [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop'
  ],
  BOOKS: [
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop'
  ],
  OTHER: [
    'https://images.unsplash.com/photo-1481349518771-2005b9565124?w=800&auto=format&fit=crop'
  ]
}

const userAvatars = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop',
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

export const MOCK_ITEMS: Item[] = [
  createMockItem(1, 'LOST', 'PHONE', 'iPhone 13 Pro Bleu', 'Bè'),
  createMockItem(2, 'FOUND', 'IDENTITY_PAPERS', 'CNI Togolaise - KOFFI Ama', 'Agoè'),
  createMockItem(3, 'LOST', 'KEYS', 'Trousseau de clés Toyota', 'Tokoin'),
  createMockItem(4, 'FOUND', 'LUGGAGE', 'Sac à dos noir HP', 'Adidogomé'),
  createMockItem(5, 'LOST', 'WALLET', 'Portefeuille cuir marron', 'Djidjolé'),
  createMockItem(6, 'FOUND', 'ELECTRONICS', 'Samsung Galaxy Buds', 'Hédzranawoé'),
  createMockItem(7, 'LOST', 'JEWELRY', 'Bague en or', 'Kodjoviakopé'),
  createMockItem(8, 'FOUND', 'PETS', 'Chien type Berger', 'Nyékonakpoè'),
  createMockItem(9, 'LOST', 'CLOTHING', 'Veste bleue marine', 'Bè'),
  createMockItem(10, 'FOUND', 'BOOKS', 'Livre de droit', 'Tokoin'),
]

export const MOCK_MATCHES: MatchResult[] = [
  {
    id: 1,
    sourceItemId: 1,
    targetItem: MOCK_ITEMS[1],
    score: 85,
    scoreDetails: {
      category: { score: 100, weight: 30, weightedScore: 30, details: {} },
      location: { score: 80, weight: 30, weightedScore: 24, details: {} },
      keywords: { score: 70, weight: 20, weightedScore: 14, details: {} },
      date: { score: 85, weight: 20, weightedScore: 17, details: {} },
      typeBonus: 0,
      total: 85,
    },
    matchedKeywords: ['iPhone', 'Bleu', 'Bè'],
    distanceKm: 2.5,
    isRead: false,
    isNotified: true,
    createdAt: new Date().toISOString(),
    notifiedAt: new Date().toISOString(),
  },
  {
    id: 2,
    sourceItemId: 1,
    targetItem: MOCK_ITEMS[3],
    score: 45,
    scoreDetails: {
      category: { score: 50, weight: 30, weightedScore: 15, details: {} },
      location: { score: 40, weight: 30, weightedScore: 12, details: {} },
      keywords: { score: 40, weight: 20, weightedScore: 8, details: {} },
      date: { score: 50, weight: 20, weightedScore: 10, details: {} },
      typeBonus: 0,
      total: 45,
    },
    matchedKeywords: ['Noir'],
    distanceKm: 5.2,
    isRead: true,
    isNotified: true,
    createdAt: new Date().toISOString(),
    notifiedAt: new Date().toISOString(),
  }
]

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    itemId: 1,
    item: MOCK_ITEMS[0],
    otherUserId: 2,
    otherUser: {
      id: 2,
      name: 'Koffi Adidogomé',
      avatar: userAvatars[0],
      city: 'Lomé',
      joinDate: '2024-02-15',
      reputationScore: 88,
    },
    lastMessage: {
      content: 'Bonjour, j\'ai peut-être retrouvé votre téléphone à Bè.',
      createdAt: new Date().toISOString(),
      isFromMe: false,
    },
    unreadCount: 1,
    matchScore: 85,
    updatedAt: new Date().toISOString(),
  }
]

export const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    conversationId: 1,
    senderId: 2,
    receiverId: 1,
    content: 'Bonjour, j\'ai peut-être retrouvé votre téléphone à Bè.',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    conversationId: 1,
    senderId: 1,
    receiverId: 2,
    content: 'Ah super ! Où exactement ?',
    isRead: true,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 3,
    conversationId: 1,
    senderId: 2,
    receiverId: 1,
    content: 'Près du marché, il était par terre.',
    isRead: false,
    createdAt: new Date().toISOString(),
  }
]

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    userId: 1,
    type: 'NEW_MATCH_HIGH',
    title: 'Nouveau match important !',
    content: 'Une annonce pour un iPhone 13 correspond à 85% à la vôtre.',
    data: { matchId: 1, itemId: 1, score: 85 },
    isRead: false,
    createdAt: new Date().toISOString(),
    actionUrl: '/matches',
  },
  {
    id: 2,
    userId: 1,
    type: 'NEW_MESSAGE',
    title: 'Nouveau message',
    content: 'Koffi vous a envoyé un message concernant votre annonce.',
    data: { conversationId: 1 },
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    actionUrl: '/messages/1',
  },
  {
    id: 3,
    userId: 1,
    type: 'ITEM_RESOLVED',
    title: 'Félicitations !',
    content: 'Votre objet a été marqué comme retrouvé.',
    data: { itemId: 3 },
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    actionUrl: '/annonces/3',
  }
]
