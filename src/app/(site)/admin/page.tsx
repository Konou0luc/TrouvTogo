// src/app/admin/page.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Search,
  Settings,
  ShieldCheck,
  TrendingUp
} from 'lucide-react'
import AdminStatsChart from '@/components/admin/AdminStatsChart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MOCK_ITEMS } from '@/lib/mockData'
import StatusBadge from '@/components/annonce/StatusBadge'

export default function AdminPage() {
  const stats = [
    { label: 'Utilisateurs', value: '3,540', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Annonces', value: '1,250', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Objets Retrouvés', value: '840', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Signalements', value: '12', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Sidebar Layout could be added, but for now a simple container */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Panel Administration</span>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900">Vue d'ensemble</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </Button>
            <Button className="bg-primary hover:bg-primary-dark gap-2">
              <TrendingUp className="h-4 w-4" />
              Rapport complet
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((s, i) => (
            <Card key={i} className="border border-neutral-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">{s.label}</p>
                    <p className="text-2xl font-bold text-neutral-900">{s.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
                    <s.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Charts Area */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border border-neutral-200">
              <CardHeader>
                <CardTitle className="text-lg">Analytiques</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminStatsChart />
              </CardContent>
            </Card>

            {/* Moderation Queue Preview */}
            <Card className="border border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Dernières annonces à modérer</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary font-bold">Voir tout</Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {MOCK_ITEMS.slice(0, 5).map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                          <Search className="h-5 w-5 text-neutral-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-neutral-900 truncate">{item.title}</p>
                          <p className="text-[10px] text-neutral-400 font-medium">Par {item.user.name} • {item.location.district}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={item.status} />
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-danger hover:text-danger hover:bg-danger/5">
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Sidebar */}
          <div className="space-y-8">
            <Card className="border border-neutral-200">
              <CardHeader>
                <CardTitle className="text-lg">Alertes système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: 'Pic de trafic détecté', level: 'info', time: '10 min' },
                  { title: '5 signalements en attente', level: 'warning', time: '25 min' },
                  { title: 'Erreur API Matching (v1)', level: 'danger', time: '1h' },
                ].map((alert, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl border border-neutral-100">
                    <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                      alert.level === 'info' ? 'bg-blue-500' : 
                      alert.level === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-neutral-900">{alert.title}</p>
                      <p className="text-[10px] text-neutral-400 font-medium">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-neutral-200 bg-neutral-900 text-white">
              <CardContent className="p-6">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  Santé du système
                </h4>
                <div className="space-y-4">
                  {[
                    { label: 'API Gateway', status: 'En ligne', color: 'text-emerald-400' },
                    { label: 'Matching Engine', status: 'En ligne', color: 'text-emerald-400' },
                    { label: 'Database', status: 'Stable', color: 'text-emerald-400' },
                    { label: 'Storage', status: '92% libre', color: 'text-blue-400' },
                  ].map((s, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="opacity-60">{s.label}</span>
                      <span className={`font-bold ${s.color}`}>{s.status}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6 bg-white/10 hover:bg-white/20 border-none text-xs font-bold">
                  Maintenance
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
