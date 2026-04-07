// src/app/(public)/annonces/[id]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { MOCK_ITEMS } from '@/lib/mockData'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  MapPin,
  Calendar,
  User as UserIcon,
  MessageSquare,
  Share2,
  AlertTriangle,
  ChevronLeft,
  Clock,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import CategoryBadge from '@/components/annonce/CategoryBadge'
import StatusBadge from '@/components/annonce/StatusBadge'
import RewardBadge from '@/components/annonce/RewardBadge'
import { useAppStore } from '@/store/useAppStore'
import AnnonceCard from '@/components/annonce/AnnonceCard'

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false })

export default function AnnonceDetailPage() {
  const { id } = useParams()
  const { user } = useAppStore()
  
  const item = MOCK_ITEMS.find(i => i.id === Number(id))
  
  if (!item) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Annonce introuvable</h1>
        <Link href="/annonces">
          <Button>Retour aux annonces</Button>
        </Link>
      </div>
    )
  }

  const isOwner = user?.id === item.userId
  const isLost = item.type === 'LOST'
  const similarItems = MOCK_ITEMS.filter(i => i.id !== item.id && i.category === item.category).slice(0, 3)

  return (
    <div className="bg-neutral-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs / Back */}
        <Link href="/annonces" className="inline-flex items-center text-sm text-neutral-500 hover:text-primary mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux annonces
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header & Images */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
              <div className="relative aspect-video bg-neutral-100 flex items-center justify-center">
                {item.images.length > 0 ? (
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-neutral-300">
                    <Clock className="h-16 w-16 mb-2 opacity-20" />
                    <span className="text-sm font-medium">Aucune photo disponible</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className={isLost ? 'bg-danger text-lg px-4 py-1' : 'bg-secondary text-lg px-4 py-1'}>
                    {isLost ? 'Perdu' : 'Trouvé'}
                  </Badge>
                  {item.reward && <RewardBadge reward={item.reward} />}
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CategoryBadge category={item.category} />
                      <StatusBadge status={item.status} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">{item.title}</h1>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full text-danger hover:text-danger hover:bg-danger/5">
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 p-4 rounded-xl bg-neutral-50 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 font-medium">Lieu</p>
                      <p className="text-sm font-bold">{item.location.district}, {item.location.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 font-medium">Date</p>
                      <p className="text-sm font-bold">{format(new Date(item.date), 'PPPP', { locale: fr })}</p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-neutral max-w-none">
                  <h3 className="text-lg font-bold mb-3">Description</h3>
                  <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
                    {item.description}
                  </p>
                </div>

                {item.depositLocation && (
                  <div className="mt-8 p-4 rounded-xl bg-secondary-light border border-secondary/10 flex gap-4">
                    <CheckCircle2 className="h-6 w-6 text-secondary shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-secondary-dark">Lieu de dépôt</p>
                      <p className="text-sm text-secondary-dark opacity-80">{item.depositLocation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <h3 className="text-lg font-bold mb-4">Localisation précise</h3>
              <div className="h-[300px] rounded-xl overflow-hidden relative">
                <MapView items={[item]} center={[item.location.latitude, item.location.longitude]} zoom={15} />
                <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md border text-xs font-medium">
                  {item.location.address}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* User Card */}
            <Card className="border-neutral-100 shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 rounded-full bg-primary-light flex items-center justify-center text-primary text-xl font-bold">
                    {item.user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900">{item.user.name}</h4>
                    <p className="text-xs text-neutral-500">Membre depuis {format(new Date(item.user.joinDate), 'MMMM yyyy', { locale: fr })}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <div key={s} className={`h-1.5 w-4 rounded-full ${s <= (item.user.reputationScore / 20) ? 'bg-secondary' : 'bg-neutral-200'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-secondary ml-1">{item.user.reputationScore}% confiance</span>
                    </div>
                  </div>
                </div>

                {isOwner ? (
                  <div className="space-y-3">
                    <Button className="w-full bg-secondary hover:bg-secondary-dark font-bold h-12">
                      Marquer comme résolu
                    </Button>
                    <Button variant="outline" className="w-full h-12">
                      Modifier l'annonce
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full bg-primary hover:bg-primary-dark font-bold h-12 gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Contacter l'annonceur
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Similar Items */}
            <div>
              <h3 className="text-lg font-bold mb-4">Annonces similaires</h3>
              <div className="space-y-4">
                {similarItems.map(similar => (
                  <AnnonceCard key={similar.id} item={similar} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
