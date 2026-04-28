'use client'

import { useAppStore } from '@/store/useAppStore'
import { useEffect, useState } from 'react'
import { fetchMesObjets } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import {
  FileText,
  CheckCircle2,
  Zap,
  ArrowRight,
  PlusCircle,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import AnnonceCard from '@/components/annonce/AnnonceCard'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function DashboardPage() {
  const { user } = useAppStore()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    let mounted = true
    fetchMesObjets()
      .then((res) => {
        if (!mounted) return
        setItems(res)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
    return () => {
      mounted = false
    }
  }, [user])

  if (!user) return null

  const myItems = items.filter((item) => item.userId === user.id)
  const activeItems = myItems.filter((item) => item.status === 'ACTIVE')
  const resolvedItems = myItems.filter((item) => item.status === 'RESOLVED')
  const firstName = user.name.split(' ')[0]
  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: fr })

  const kpiCards = [
    {
      label: 'Annonces actives',
      value: activeItems.length,
      icon: FileText,
      hint: 'Visibles sur le fil',
    },
    {
      label: 'Clôturées',
      value: resolvedItems.length,
      icon: CheckCircle2,
      hint: 'Objets retrouvés ou classés',
    },
    {
      label: 'Matchs en cours',
      value: 3,
      icon: Zap,
      hint: 'À examiner',
    },
    {
      label: 'Messages non lus',
      value: 2,
      icon: MessageSquare,
      hint: 'Conversations',
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-[88rem] px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
        <header className="mb-12 flex flex-col gap-8 border-b border-border pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-muted-foreground">Tableau de bord</p>
            <h1 className="display-heading mt-2 text-3xl text-foreground sm:text-4xl">
              Bonjour, {firstName}
            </h1>
            <p className="mt-3 text-[15px] text-muted-foreground capitalize">{today}</p>
          </div>
          <Link href="/declarer/perdu">
            <Button className="h-11 rounded-full bg-primary px-6 text-[14px] font-medium text-white hover:bg-primary-dark">
              <PlusCircle className="mr-2 h-4 w-4" strokeWidth={1.75} />
              Nouvelle annonce
            </Button>
          </Link>
        </header>

        <div className="mb-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpiCards.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
            >
              <Card className="overflow-hidden rounded-2xl border border-neutral-200 bg-card transition-colors hover:border-neutral-300 dark:border-neutral-700 dark:bg-card dark:hover:border-neutral-600">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-popover text-card-foreground">
                      <kpi.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    </div>
                        <span className="tabular-nums font-heading text-3xl font-medium tracking-tight text-foreground">
                      {kpi.value}
                    </span>
                  </div>
                      <p className="mt-5 text-[13px] font-medium text-foreground">{kpi.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{kpi.hint}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-12 lg:grid-cols-3 lg:gap-14">
          <div className="space-y-14 lg:col-span-2">
            <section>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="eyebrow text-primary">Correspondances</p>
                  <h2 className="display-heading mt-1 text-2xl text-foreground">À traiter en priorité</h2>
                </div>
                <Link
                  href="/matches"
                  className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-primary"
                >
                  Tout voir
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
                </Link>
              </div>

              <div className="divide-y divide-neutral-700 overflow-hidden rounded-2xl border border-border bg-card">
                {[1, 2].map((m) => (
                  <div key={m} className="flex cursor-pointer items-center gap-5 p-5 transition-colors hover:bg-popover/60">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10">
                      <Zap className="h-6 w-6 text-primary" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-heading text-[15px] font-medium text-foreground">
                          iPhone 13 Pro — zone Agoè
                        </h3>
                        <Badge className="rounded-md border-0 bg-secondary/15 px-2 py-0.5 text-[11px] font-medium text-secondary-dark">
                          Score 95
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">Il y a 45 min · signalé par Ama T.</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-6">
                <p className="eyebrow text-primary">Vos fiches</p>
                <h2 className="display-heading mt-1 text-2xl text-foreground">Annonces publiées</h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {activeItems.length > 0 ? (
                  activeItems.map((item) => <AnnonceCard key={item.id} item={item} />)
                ) : (
                  <div className="col-span-full rounded-2xl border border-dashed border-border bg-card px-8 py-16 text-center">
                    <p className="text-[15px] text-muted-foreground">Aucune annonce active pour le moment.</p>
                    <Link href="/declarer/perdu" className="mt-6 inline-block">
                      <Button variant="outline" className="rounded-full border-neutral-300 font-medium">
                        Déclarer une perte
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-10">
              <Card className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground">
              <CardContent className="relative p-8">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-popover font-heading text-xl font-medium text-card-foreground">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-heading text-lg font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">Profil vérifié</p>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-border pt-8">
                    <div className="flex items-end justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Réputation</span>
                      <span className="tabular-nums font-heading text-2xl font-medium text-foreground">98%</span>
                    </div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-popover">
                      <div className="h-full w-[98%] rounded-full bg-secondary" />
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-8">
                    <div>
                      <p className="text-xs text-muted-foreground">Restitutions</p>
                      <p className="mt-1 tabular-nums font-heading text-2xl font-medium text-foreground">{user.stats.itemsReturned}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Impact</p>
                      <p className="mt-1 font-heading text-2xl font-medium text-foreground">Élevé</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="font-heading text-lg font-medium text-foreground">Activité récente</h3>
              <div className="mt-4 space-y-0 overflow-hidden rounded-2xl border border-border bg-card">
                {[
                  { title: 'Correspondance validée', time: '14:20', icon: Zap },
                  { title: 'Nouveau message', time: 'Hier', icon: MessageSquare },
                  { title: 'Compte certifié', time: 'Lundi', icon: ShieldCheck },
                ].map((activity, i) => (
                  <div
                    key={activity.title}
                    className={`flex gap-4 px-5 py-4 ${i > 0 ? 'border-t border-border' : ''}`}
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-popover text-card-foreground">
                      <activity.icon className="h-4 w-4" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
