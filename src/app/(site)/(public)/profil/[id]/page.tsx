// src/app/(public)/profil/[id]/page.tsx
"use client"

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fetchObjetsPage, fetchUserPublic, fetchCommunauteStats } from '@/lib/api'
import { UserPublic } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  MapPin,
  CheckCircle2,
  Search,
  MessageSquare,
  Star,
  Award,
  Users,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import AnnonceCard from '@/components/annonce/AnnonceCard'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const { id } = useParams()
  const [user, setUser] = useState<UserPublic | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const userId = Number(id)
    if (!userId) return

    let mounted = true

    fetchUserPublic(userId).then((u) => {
      if (!mounted) return
      if (u) setUser(u)
    })

    // Load public items for this user (search endpoint supports proprietaireId)
    fetchObjetsPage({ ownerId: userId, size: 100 })
      .then((p) => {
        if (!mounted) return
        setItems(p.items)
      })
      .catch(() => {
        if (!mounted) return
        setItems([])
      })

    // community stats (for the small stat card)
    fetchCommunauteStats()
      .then((s) => {
        if (!mounted) return
        setStats(s)
      })
      .catch(() => setStats(null))

    return () => {
      mounted = false
    }
  }, [id])

  const userItems = items
  const activeItems = userItems.filter((it) => it.status === 'ACTIVE')
  const resolvedItems = userItems.filter((it) => it.status === 'RESOLVED')

  if (!user) return null

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="container mx-auto px-4 py-10">
        {/* Back Button */}
        <Link href="/annonces" className="inline-flex items-center text-sm text-neutral-500 hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux annonces
        </Link>

        {/* Profile Header */}
        <div className="mb-10 rounded-2xl border border-neutral-200 bg-card p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-primary-light text-5xl font-black text-primary">
                {user.name.charAt(0)}
              </div>
              <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center border-4 border-white">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black text-neutral-900 mb-2">
                {user.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                <div className="flex items-center gap-2 text-neutral-500">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.city}, Togo</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-500">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Membre depuis {format(new Date(user.joinDate), 'MMMM yyyy', { locale: fr })}
                  </span>
                </div>
              </div>
              
              {/* Reputation */}
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star 
                      key={s} 
                      className={`h-5 w-5 ${
                        s <= Math.round(user.reputationScore / 20) 
                          ? 'text-accent fill-accent' 
                          : 'text-neutral-200'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-neutral-600">
                  {user.reputationScore}% de confiance
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button className="bg-primary hover:bg-primary-dark font-bold h-12 px-8 rounded-xl gap-2">
                <MessageSquare className="h-5 w-5" />
                Contacter
              </Button>
              <Button variant="outline" className="font-bold h-12 px-8 rounded-xl">
                Signaler
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Annonces actives', value: activeItems.length, icon: Search, color: 'text-primary' },
            { label: 'Objets retrouvés', value: resolvedItems.length, icon: CheckCircle2, color: 'text-secondary' },
            { label: 'Membres de la communauté', value: stats?.personnesActives ?? '-', icon: Users, color: 'text-accent' },
            { label: 'Score de réputation', value: `${user.reputationScore}%`, icon: Award, color: 'text-primary' },
          ].map((stat, i) => (
            <Card key={i} className="border border-neutral-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl bg-card ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-neutral-900">{stat.value}</p>
                    <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Listings */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Annonces de {user.name.split(' ')[0]}</h2>
              <p className="text-sm text-neutral-500 mt-1">
                {activeItems.length} annonce{activeItems.length > 1 ? 's' : ''} active{activeItems.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {activeItems.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <AnnonceCard item={item} />
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 border-neutral-200 bg-transparent">
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 text-neutral-200 mx-auto mb-4" />
                <p className="text-neutral-500 font-medium">Aucune annonce active pour le moment</p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}