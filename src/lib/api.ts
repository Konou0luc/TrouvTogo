// src/lib/api.ts
import axios from 'axios'
import {
  AuthResponse,
  Conversation,
  CreateItemRequest,
  DashboardStats,
  Item,
  ItemStatus,
  ItemType,
  LoginRequest,
  MatchResult,
  Message,
  Notification,
  NotificationType,
  PublicStats,
  RegisterRequest,
  SearchRequest,
  SearchResponse,
  SuggestionsResponse,
  User,
  UserPublic,
  UserStats
} from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1'

export const api = axios.create({ baseURL: BASE_URL })

// Injecter le token JWT automatiquement
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Refresh token si 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
          localStorage.setItem('token', data.token)
          error.config.headers.Authorization = `Bearer ${data.token}`
          return api(error.config)
        } catch {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
      }
    }
    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────────────────────────
export const authAPI = {
  register:       (data: RegisterRequest)        => api.post<AuthResponse>('/auth/register', data),
  login:          (data: LoginRequest)           => api.post<AuthResponse>('/auth/login', data),
  logout:         ()                             => api.post('/auth/logout'),
  refresh:        (refreshToken: string)         => api.post('/auth/refresh', { refreshToken }),
  forgotPassword: (email: string)                => api.post('/auth/forgot-password', { email }),
  resetPassword:  (token: string, newPassword: string) =>
                    api.post('/auth/reset-password', { token, newPassword }),
}

// ── Users ─────────────────────────────────────────────────────────
export const usersAPI = {
  getMe:      ()                => api.get<User>('/users/me'),
  updateMe:   (data: Partial<User>) => api.put<User>('/users/me', data),
  getMyStats: ()                => api.get<UserStats>('/users/me/stats'),
  getUser:    (id: number)      => api.get<UserPublic>(`/users/${id}`),
}

// ── Items ─────────────────────────────────────────────────────────
export const itemsAPI = {
  list:      (params?: Partial<SearchRequest>) => api.get<SearchResponse>('/items', { params }),
  get:       (id: number)                      => api.get<Item>(`/items/${id}`),
  create:    (data: FormData)                  => api.post<Item>('/items', data, {
               headers: { 'Content-Type': 'multipart/form-data' } }),
  update:    (id: number, data: Partial<CreateItemRequest>) => api.put<Item>(`/items/${id}`, data),
  delete:    (id: number)                      => api.delete(`/items/${id}`),
  resolve:   (id: number, message?: string)    => api.patch<Item>(`/items/${id}/resolve`, { message }),
  getMyItems:(params?: { status?: ItemStatus; type?: ItemType }) =>
               api.get<Item[]>('/items/user/me', { params }),
}

// ── Matching ──────────────────────────────────────────────────────
export const matchingAPI = {
  forItem: (itemId: number, params?: { minScore?: number; limit?: number }) =>
             api.get<{ sourceItem: Item; matches: MatchResult[]; total: number }>(
               `/matches/for-item/${itemId}`, { params }),

  suggestions: (params?: { limit?: number; minScore?: number; onlyUnread?: boolean }) =>
                 api.get<SuggestionsResponse>('/matches/suggestions', { params }),

  newMatches: (params?: { since?: string; minScore?: number }) =>
                api.get<{ matches: MatchResult[]; total: number; since: string }>(
                  '/matches/new', { params }),

  trigger:    (itemId: number) => api.post(`/matches/trigger/${itemId}`),
  triggerAll: ()               => api.post('/matches/trigger-all'),

  getScore:   (matchId: number) => api.get(`/matches/${matchId}/score`),
  markRead:   (matchId: number) => api.patch(`/matches/${matchId}/read`),

  unreadCount: () => api.get<{ count: number; highScoreCount: number }>('/matches/unread-count'),
}

// ── Search ────────────────────────────────────────────────────────
export const searchAPI = {
  search: (data: SearchRequest)            => api.post<SearchResponse>('/search', data),
  nearby: (lat: number, lng: number, params?: { radius?: number; type?: ItemType; limit?: number }) =>
            api.get<Item[]>('/search/nearby', { params: { latitude: lat, longitude: lng, ...params } }),
}

// ── Conversations & Messages ──────────────────────────────────────
export const messagesAPI = {
  getConversations:  (params?: { page?: number; limit?: number }) =>
                       api.get<Conversation[]>('/conversations', { params }),
  createConversation:(data: { itemId: number; matchId?: number }) =>
                       api.post<Conversation>('/conversations', data),
  getMessages:       (convId: number, params?: { page?: number; limit?: number }) =>
                       api.get<Message[]>(`/conversations/${convId}/messages`, { params }),
  sendMessage:       (convId: number, content: string) =>
                       api.post<Message>(`/conversations/${convId}/messages`, { content }),
  markRead:          (convId: number) => api.patch(`/conversations/${convId}/read`),
}

// ── Notifications ─────────────────────────────────────────────────
export const notificationsAPI = {
  list:       (params?: { unreadOnly?: boolean; type?: NotificationType; page?: number; limit?: number }) =>
                api.get<Notification[]>('/notifications', { params }),
  markRead:   (id: number)  => api.patch(`/notifications/${id}/read`),
  markAllRead:()            => api.patch('/notifications/read-all'),
  unreadCount:()            => api.get<{ count: number; byType: Record<string, number> }>(
                                '/notifications/unread-count'),
}

// ── Stats ─────────────────────────────────────────────────────────
export const statsAPI = {
  dashboard: () => api.get<DashboardStats>('/stats/dashboard'),
  public:    () => api.get<PublicStats>('/stats/public'),
}
