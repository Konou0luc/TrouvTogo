// Client HTTP aligné sur l'API CollectObjet (Spring Boot)
import axios, { AxiosError } from 'axios'
import { useAppStore } from '@/store/useAppStore'
import type {
  BackendAuthResponse,
  BackendCategorie,
  BackendObjet,
  CommunauteStats,
  SpringPage,
  UploadUrlsPayload,
} from '@/lib/backend-types'
import { backendObjetToItem, itemTypeToBackend } from '@/lib/mappers'
import type {
  Item,
  ItemStatus,
  ItemType,
  LoginRequest,
  Pagination,
  RegisterRequest,
  SearchResponse,
  User,
} from '@/types'

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8081/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    const d = response.data as {
      success?: boolean
      data?: unknown
      message?: string
    }
    if (d && typeof d === 'object' && 'success' in d) {
      if (d.success === false) {
        return Promise.reject(new Error(d.message ?? 'Erreur serveur'))
      }
      if (d.success === true) {
        response.data = d.data !== undefined ? d.data : d
      }
    }
    return response
  },
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      useAppStore.getState().clearAuth()
    }
    const msg =
      error.response?.data?.message ??
      error.message ??
      'Une erreur réseau est survenue'
    return Promise.reject(new Error(msg))
  }
)

// ── Auth ──────────────────────────────────────────────────────────

export async function loginRequest(data: LoginRequest): Promise<BackendAuthResponse> {
  const res = await api.post<BackendAuthResponse>('/auth/login', {
    email: data.email,
    password: data.password,
  })
  return res.data
}

export async function registerRequest(
  payload: RegisterRequest & { username: string }
): Promise<BackendAuthResponse> {
  const res = await api.post<BackendAuthResponse>('/auth/register', {
    username: payload.username,
    email: payload.email,
    password: payload.password,
    telephone: payload.phone?.replace(/\s/g, '') || undefined,
  })
  return res.data
}

export function authToUser(
  a: BackendAuthResponse,
  extras?: { city?: string }
): User {
  const city = extras?.city ?? 'Lomé'
  return {
    id: a.id,
    name: a.username,
    email: a.email,
    phone: a.telephone ?? '',
    city,
    avatar: null,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    stats: {
      totalItems: 0,
      itemsFound: 0,
      itemsReturned: 0,
      activeItems: 0,
      pendingMatches: 0,
    },
    role: a.role === 'ROLE_ADMIN' ? 'ADMIN' : 'USER',
  }
}

// ── Catégories ────────────────────────────────────────────────────

export async function fetchCategories(): Promise<BackendCategorie[]> {
  const res = await api.get<BackendCategorie[]>('/categories')
  return res.data
}

// ── Statistiques ─────────────────────────────────────────────────

export async function fetchCommunauteStats(): Promise<CommunauteStats> {
  const res = await api.get<CommunauteStats>('/stats/communaute')
  return res.data
}

// ── Objets ────────────────────────────────────────────────────────

export interface ListObjetsParams {
  page?: number
  size?: number
  type?: ItemType
  statut?: ItemStatus
  keyword?: string
  categorieId?: number
}

function itemStatusToBackend(s: ItemStatus | undefined): string | undefined {
  if (!s) return undefined
  const m: Record<ItemStatus, string> = {
    ACTIVE: 'ACTIF',
    RESOLVED: 'RESOLU',
    CLOSED: 'ARCHIVE',
    EXPIRED: 'ARCHIVE',
  }
  return m[s]
}

export async function fetchObjetsPage(
  params: ListObjetsParams = {}
): Promise<{ items: Item[]; pagination: Pagination }> {
  const page = params.page ?? 0
  const size = params.size ?? 48
  const type =
    params.type != null ? itemTypeToBackend(params.type) : undefined
  const statut = itemStatusToBackend(params.statut)

  const res = await api.get<SpringPage<BackendObjet>>('/objets/recherche', {
    params: {
      page,
      size,
      keyword: params.keyword || undefined,
      categorieId: params.categorieId,
      type,
      statut,
    },
  })

  const pageData = res.data
  const content = pageData.content ?? []

  const items: Item[] = content.map((o) => backendObjetToItem(o))
  const pagination: Pagination = {
    page: pageData.number ?? 0,
    limit: pageData.size ?? size,
    total: pageData.totalElements ?? items.length,
    pages: pageData.totalPages ?? 1,
  }

  return { items, pagination }
}

export async function fetchObjetById(id: number): Promise<Item> {
  const res = await api.get<BackendObjet>(`/objets/${id}`)
  return backendObjetToItem(res.data)
}

export interface CreateObjetPayload {
  titre: string
  description: string
  type: 'PERDU' | 'TROUVE'
  localisation: string
  dateEvenement: string
  categorieId: number | null
  photosUrls: string[]
}

export async function createObjet(
  payload: CreateObjetPayload
): Promise<Item> {
  const res = await api.post<BackendObjet>('/objets', {
    titre: payload.titre,
    description: payload.description,
    type: payload.type,
    localisation: payload.localisation,
    dateEvenement: payload.dateEvenement,
    categorieId: payload.categorieId ?? undefined,
    photosUrls: payload.photosUrls,
  })
  return backendObjetToItem(res.data)
}

export async function uploadImages(files: File[]): Promise<string[]> {
  const form = new FormData()
  files.forEach((f) => form.append('files', f))
  const res = await api.post<UploadUrlsPayload>('/upload/images', form, {
    transformRequest: [
      (data, headers) => {
        if (data instanceof FormData) {
          delete headers['Content-Type']
        }
        return data
      },
    ],
  })
  return res.data.urls
}

export async function fetchMesObjets(): Promise<Item[]> {
  const res = await api.get<BackendObjet[]>('/objets/mes-objets')
  return res.data.map((o) => backendObjetToItem(o))
}

export async function fetchSearchResponse(
  params: ListObjetsParams = {}
): Promise<SearchResponse> {
  const { items, pagination } = await fetchObjetsPage(params)
  return {
    items,
    pagination,
    filters: {},
  }
}
