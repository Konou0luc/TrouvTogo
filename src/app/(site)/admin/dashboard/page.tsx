"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdminButton from '@/components/admin/AdminButton'
import { Search } from 'lucide-react'
import { Users, FileText, CheckCircle2, MessageSquare, ShieldCheck, TrendingUp } from 'lucide-react'
import AdminStatsChart from '@/components/admin/AdminStatsChart'
import { fetchObjetsPage, fetchCommunauteStats, fetchConversations, fetchMatchesForUser } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import StatusBadge from '@/components/annonce/StatusBadge'
import { useAppStore } from '@/store/useAppStore'

import Breadcrumb from '@/components/layout/Breadcrumb'

export default function AdminDashboardPage() {
  const [previewItems, setPreviewItems] = useState<any[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    resolved: 0,
    lost: 0,
    found: 0,
    matchesInProgress: 0,
    unreadMessages: 0,
    personnesActives: 0,
  })
  const user = useAppStore((s) => s.user)

  useEffect(() => {
    let mounted = true
    fetchObjetsPage({ page: 0, size: 5 })
      .then((p) => {
        if (!mounted) return
        setPreviewItems(p.items)
      })
      .catch(() => setPreviewItems([]))
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true
    async function loadStats() {
      setLoadingStats(true)
      try {
        const [totalP, activeP, resolvedP, lostP, foundP, commu, convs, matches] = await Promise.all([
          fetchObjetsPage({ page: 0, size: 1 }),
          fetchObjetsPage({ page: 0, size: 1, statut: 'ACTIVE' }),
          fetchObjetsPage({ page: 0, size: 1, statut: 'RESOLVED' }),
          fetchObjetsPage({ page: 0, size: 1, type: 'LOST' }),
          fetchObjetsPage({ page: 0, size: 1, type: 'FOUND' }),
          fetchCommunauteStats().catch(() => null),
          fetchConversations().catch(() => []),
          fetchMatchesForUser().catch(() => []),
        ])

        if (!mounted) return

        setStats({
          total: totalP?.pagination?.total ?? 0,
          active: activeP?.pagination?.total ?? 0,
          resolved: resolvedP?.pagination?.total ?? 0,
          lost: lostP?.pagination?.total ?? 0,
          found: foundP?.pagination?.total ?? 0,
          matchesInProgress: Array.isArray(matches) ? matches.length : 0,
          unreadMessages: Array.isArray(convs) ? convs.reduce((s, c) => s + (c.unreadCount ?? 0), 0) : 0,
          personnesActives: commu?.personnesActives ?? 0,
        })
      } catch (e) {
        // ignore errors and keep defaults
      } finally {
        if (mounted) setLoadingStats(false)
      }
    }

    loadStats()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-10">
        <Breadcrumb items={[{ label: 'Administration', href: '/admin/dashboard' }, { label: 'Tableau de bord' }]} />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Tableau de bord</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Bonjour{user?.name ? `, ${user.name}` : ', Admin'} —{' '}
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="flex gap-3">
            <AdminButton variant="outline">Export</AdminButton>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-neutral-200 dark:border-neutral-800">
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-neutral-400 uppercase font-bold">Annonces actives</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {loadingStats ? <Skeleton className="h-6 w-16" /> : new Intl.NumberFormat('fr-FR').format(stats.active)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 dark:border-neutral-800">
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-neutral-400 uppercase font-bold">Clôturées</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {loadingStats ? <Skeleton className="h-6 w-12" /> : new Intl.NumberFormat('fr-FR').format(stats.resolved)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-900 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 dark:border-neutral-800">
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-neutral-400 uppercase font-bold">Matches en cours</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {loadingStats ? <Skeleton className="h-6 w-8" /> : new Intl.NumberFormat('fr-FR').format(stats.matchesInProgress)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-900 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 dark:border-neutral-800">
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-neutral-400 uppercase font-bold">Messages non lus</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {loadingStats ? <Skeleton className="h-6 w-10" /> : new Intl.NumberFormat('fr-FR').format(stats.unreadMessages)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-neutral-200 dark:border-neutral-800">
              <CardHeader>
                <CardTitle>Analytique</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminStatsChart />
              </CardContent>
            </Card>

            <Card className="border-neutral-200 dark:border-neutral-800">
              <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Dernières annonces à modérer</CardTitle>
                  <Link href="/admin/moderation">
                    <AdminButton variant="ghost" size="sm" className="text-primary font-bold">
                      Voir tout
                    </AdminButton>
                  </Link>
                </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {previewItems.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                          <Search className="h-5 w-5 text-neutral-400 dark:text-neutral-300" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{item.title}</p>
                          <p className="text-[10px] text-neutral-400 dark:text-neutral-400 font-medium">Par {item.user?.name ?? '—'} • {item.location?.district ?? '—'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={item.status} />
                        <div className="flex gap-1">
                          <Link href={`/admin/moderation?selected=${item.id}`}>
                            <AdminButton size="icon" variant="ghost" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                              <CheckCircle2 className="h-4 w-4" />
                            </AdminButton>
                          </Link>
                          <Link href={`/messages?itemId=${item.id}`}>
                            <AdminButton size="icon" variant="ghost" className="h-8 w-8 text-neutral-500 hover:bg-neutral-50">
                              <MessageSquare className="h-4 w-4" />
                            </AdminButton>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                  {previewItems.length === 0 && <div className="p-6 text-center text-sm text-neutral-500 dark:text-neutral-400">Aucune annonce pour le moment</div>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-neutral-200 dark:border-neutral-800">
              <CardContent className="p-6">
                <h4 className="text-sm font-bold text-neutral-500">Profil Admin</h4>
                <div className="mt-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xl font-bold text-neutral-700 dark:text-white">A</div>
                  <div>
                    <p className="font-bold text-neutral-900 dark:text-white">{user?.name ?? 'Admin'}</p>
                    <p className="text-xs text-neutral-400">{user?.email ?? 'admin@example.com'}</p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm font-bold">Réputation</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {loadingStats ? <Skeleton className="h-6 w-12 mx-auto" /> : `${Math.round(stats.total ? (stats.resolved / Math.max(1, stats.total)) * 100 : 98)}%`}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold">Restitutions</p>
                    <p className="text-2xl font-bold">{loadingStats ? <Skeleton className="h-6 w-12 mx-auto" /> : new Intl.NumberFormat('fr-FR').format(stats.resolved)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold">Impact</p>
                    <p className="text-2xl font-bold">{loadingStats ? <Skeleton className="h-6 w-16 mx-auto" /> : (stats.resolved >= 100 ? 'Élevé' : stats.resolved >= 20 ? 'Moyen' : 'Faible')}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/profil">
                      <AdminButton className="w-full" variant="outline">Voir le profil</AdminButton>
                    </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 dark:border-neutral-800">
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
                <CardContent className="space-y-3 flex flex-col items-start">
                  <Link href="/admin/categories"><AdminButton className="w-full bg-primary text-white" variant="default">Gérer catégories</AdminButton></Link>
                  <Link href="/admin/moderation"><AdminButton className="w-full bg-amber-600 text-white" variant="default">Modération</AdminButton></Link>
                  <Link href="/admin/settings"><AdminButton className="w-full bg-neutral-700 text-white dark:bg-neutral-700" variant="default">Paramètres</AdminButton></Link>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
