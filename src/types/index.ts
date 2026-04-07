// src/types/index.ts

export type ItemType = 'LOST' | 'FOUND'

export type ItemCategory =
  | 'ELECTRONICS' | 'IDENTITY_PAPERS' | 'KEYS' | 'LUGGAGE'
  | 'CLOTHING' | 'WALLET' | 'PHONE' | 'JEWELRY' | 'BOOKS'
  | 'PETS' | 'OTHER'

export type ItemStatus = 'ACTIVE' | 'RESOLVED' | 'CLOSED' | 'EXPIRED'

export type NotificationType =
  | 'NEW_MATCH_HIGH' | 'NEW_MATCH_MEDIUM' | 'NEW_MESSAGE'
  | 'MATCH_VIEWED' | 'ITEM_RESOLVED' | 'ITEM_EXPIRING' | 'REMINDER'

export interface Location {
  address: string        // ex: "Bè, Lomé"
  city: string           // ex: "Lomé"
  district: string       // ex: "Bè"
  latitude: number       // ex: 6.1319
  longitude: number      // ex: 1.2225
}

export interface UserPublic {
  id: number
  name: string
  avatar: string | null
  city: string
  joinDate: string       // ISO date
  reputationScore: number
}

export interface UserStats {
  totalItems: number
  itemsFound: number
  itemsReturned: number
  activeItems: number
  pendingMatches: number
}

export interface User {
  id: number
  name: string
  email: string
  phone: string
  city: string
  avatar: string | null
  createdAt: string
  lastLoginAt: string
  stats: UserStats
  role?: 'USER' | 'ADMIN'
}

export interface Item {
  id: number
  type: ItemType
  category: ItemCategory
  title: string
  description: string
  location: Location
  depositLocation: string | null
  date: string           // ISO date
  images: string[]
  status: ItemStatus
  userId: number
  user: UserPublic
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  reward: string | null  // ex: "5000 FCFA"
  matchCount: number
}

export interface MatchScoreComponent {
  score: number          // 0-100
  weight: number         // pondération %
  weightedScore: number
  details: Record<string, unknown>
}

export interface MatchScoreDetails {
  category: MatchScoreComponent
  location: MatchScoreComponent
  keywords: MatchScoreComponent
  date: MatchScoreComponent
  typeBonus: number
  total: number
}

export interface MatchResult {
  id: number
  sourceItemId: number
  targetItem: Item
  score: number          // 0-100
  scoreDetails: MatchScoreDetails
  matchedKeywords: string[]
  distanceKm: number | null
  isRead: boolean
  isNotified: boolean
  createdAt: string
  notifiedAt: string | null
}

export interface Conversation {
  id: number
  itemId: number
  item: Item
  otherUserId: number
  otherUser: UserPublic
  lastMessage: {
    content: string
    createdAt: string
    isFromMe: boolean
  }
  unreadCount: number
  matchScore: number
  updatedAt: string
}

export interface Message {
  id: number
  conversationId: number
  senderId: number
  receiverId: number
  content: string
  isRead: boolean
  createdAt: string
}

export interface Notification {
  id: number
  userId: number
  type: NotificationType
  title: string
  content: string
  data: {
    matchId?: number
    itemId?: number
    score?: number
    conversationId?: number
  }
  isRead: boolean
  createdAt: string
  actionUrl: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface SearchResponse {
  items: Item[]
  pagination: Pagination
  filters: Record<string, unknown>
}

export interface DashboardStats {
  items: {
    total: number
    lost: number
    found: number
    resolved: number
    active: number
  }
  matches: {
    total: number
    highScore: number
    unread: number
  }
  recentActivity: RecentActivity[]
}

export interface RecentActivity {
  id: number
  type: 'ITEM_CREATED' | 'ITEM_RESOLVED' | 'NEW_MATCH' | 'MESSAGE_RECEIVED'
  item?: Item
  match?: MatchResult
  createdAt: string
}

export interface PublicStats {
  totalItems: number
  resolvedItems: number
  successRate: number
  activeUsers: number
  topCategories: { category: string; count: number }[]
  averageMatchScore: number
}

export interface SuggestionsResponse {
  summary: {
    totalMatches: number
    highScoreMatches: number
    mediumScoreMatches: number
  }
  matchesByItem: {
    userItem: Item
    matches: MatchResult[]
    bestScore: number
  }[]
}

// Requêtes
export interface RegisterRequest {
  name: string
  email: string
  password: string
  phone?: string
  city?: string
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: User
}

export interface CreateItemRequest {
  type: ItemType
  category: ItemCategory
  title: string
  description: string
  location: Location
  depositLocation?: string
  date: string
  images?: File[]
  reward?: string
}

export interface SearchRequest {
  query?: string
  type?: ItemType
  category?: ItemCategory
  city?: string
  radius?: number
  latitude?: number
  longitude?: number
  dateFrom?: string
  dateTo?: string
  status?: ItemStatus
  sortBy?: 'RECENT' | 'RELEVANCE' | 'DISTANCE' | 'MATCH_SCORE'
  page?: number
  limit?: number
}
