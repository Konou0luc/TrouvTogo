/** DTO alignés sur le backend Spring (CollectObjet) */

export interface ApiEnvelope<T> {
  success: boolean
  message?: string
  data?: T
}

export interface BackendAuthResponse {
  token: string
  type: string
  id: number
  username: string
  email: string
  telephone: string | null
  role: 'ROLE_USER' | 'ROLE_ADMIN'
}

export interface BackendObjet {
  id: number
  titre: string
  description: string | null
  type: 'PERDU' | 'TROUVE'
  statut: 'ACTIF' | 'RESOLU' | 'ARCHIVE'
  localisation: string | null
  dateEvenement: string | null
  categorieNom: string | null
  categorieDescription: string | null
  categorieId: number | null
  proprietaireUsername: string
  proprietaireId: number
  photosUrls: string[]
  createdAt: string
  updatedAt: string
}

export interface SpringPage<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface BackendCategorie {
  id: number
  nom: string
  description: string | null
}

/** GET /stats/communaute */
export interface CommunauteStats {
  personnesActives: number
}

export interface UploadUrlsPayload {
  urls: string[]
}
