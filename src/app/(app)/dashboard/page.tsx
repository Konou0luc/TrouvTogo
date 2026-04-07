// src/app/(app)/dashboard/page.tsx
'use client'

import { useAppStore } from '@/store/useAppStore'
import { Card, CardContent } from '@/components/ui/card'
import { 
  FileText, 
  CheckCircle2, 
  Zap, 
  Bell, 
  ArrowRight,
  PlusCircle,
  MessageSquare,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MOCK_ITEMS } from '@/lib/mockData'
import AnnonceCard from '@/components/annonce/AnnonceCard'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const { user } = useAppStore()
  
  if (!user) return null

  const myItems = MOCK_ITEMS.filter(item => item.userId === user.id)
  const activeItems = myItems.filter(item => item.status === 'ACTIVE')
  const resolvedItems = myItems.filter(item => item.status === 'RESOLVED')

  const kpiCards = [
    { label: 'Actives', value: activeItems.length, icon: FileText, color: 'text-primary', bg: 'bg-primary/5' },
    { label: 'Retrouvés', value: resolvedItems.length, icon: CheckCircle2, color: 'text-secondary', bg: 'bg-secondary/5' },
    { label: 'Matchs', value: 3, icon: Zap, color: 'text-accent', bg: 'bg-accent/5' },
    { label: 'Messages', value: 2, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/5' },
  ]

  return (
    <div className="bg-neutral-50/50 min-h-screen pb-32">
      <div className="container mx-auto px-4 py-12">
        {/* Header Premium */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary fill-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Espace Personnel</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tighter">
              Ravi de vous revoir, <span className="text-primary">{user.name.split(' ')[0]}</span>.
            </h1>
          </div>
          <Link href="/declarer/perdu">
            <Button className="bg-primary hover:bg-primary-dark font-black text-sm uppercase tracking-tighter h-16 px-8 rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 gap-3">
              <PlusCircle className="h-5 w-5" />
              Nouvelle Annonce
            </Button>
          </Link>
        </div>

        {/* KPI Grid Senior */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {kpiCards.map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden group hover:shadow-xl transition-all duration-500 rounded-[2rem]">
                <CardContent className="p-8">
                  <div className="flex justify-between items-center mb-4">
                    <div className={`h-12 w-12 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <kpi.icon className="h-6 w-6" />
                    </div>
                    <p className={`text-4xl font-black tracking-tighter ${kpi.color}`}>{kpi.value}</p>
                  </div>
                  <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">{kpi.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-12">
            {/* Recent Matches Premium */}
            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Matchs intelligents</h2>
                  <p className="text-sm text-neutral-400 font-bold uppercase tracking-widest mt-1">3 NOUVELLES CORRESPONDANCES</p>
                </div>
                <Link href="/matches" className="text-sm font-black text-primary hover:underline flex items-center gap-2 group">
                  VOIR TOUT <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {[1, 2].map((m) => (
                  <div key={m} className="bg-white p-6 rounded-[2rem] flex items-center gap-6 border border-neutral-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                    <div className="h-16 w-16 rounded-2xl bg-neutral-100 shrink-0 overflow-hidden relative">
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <Zap className="h-6 w-6 text-primary fill-primary animate-pulse" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-black text-neutral-900 truncate">iPhone 13 Pro trouvé à Agoè</h4>
                        <Badge className="bg-secondary text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm border-none">95% SCORE</Badge>
                      </div>
                      <p className="text-xs text-neutral-400 font-medium">Signalé il y a 45 minutes par Ama T.</p>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 text-primary">
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            {/* My Items Grid */}
            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Mes annonces</h2>
                  <p className="text-sm text-neutral-400 font-bold uppercase tracking-widest mt-1">GESTION DE VOS SIGNALEMENTS</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-8">
                {activeItems.length > 0 ? (
                  activeItems.map(item => (
                    <AnnonceCard key={item.id} item={item} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-neutral-100">
                    <p className="text-neutral-400 font-bold mb-6">Vous n'avez pas encore d'annonces.</p>
                    <Link href="/declarer/perdu">
                      <Button variant="outline" className="rounded-2xl font-black text-xs uppercase tracking-widest h-12 px-6">Lancer un signalement</Button>
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            {/* Reputation Card Senior */}
            <Card className="bg-neutral-900 text-white border-none rounded-[3rem] overflow-hidden relative group">
              <div className="absolute top-0 right-0 h-64 w-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] group-hover:scale-110 transition-transform duration-1000" />
              <CardContent className="p-10 relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xl border border-white/10">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-xl">{user.name}</h4>
                    <p className="text-[10px] font-black text-secondary-light uppercase tracking-widest mt-1">Citoyen Vérifié</p>
                  </div>
                </div>
                
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between items-end">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Réputation</p>
                    <p className="text-2xl font-black">98%</p>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[98%] rounded-full shadow-[0_0_15px_rgba(15,110,86,0.5)]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Restitués</p>
                    <p className="text-3xl font-black">{user.stats.itemsReturned}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Impact</p>
                    <p className="text-3xl font-black">High</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications Activity */}
            <section>
              <h2 className="text-xl font-black mb-6 tracking-tight">Activité</h2>
              <div className="bg-white rounded-[2.5rem] p-8 border border-neutral-100 shadow-sm space-y-8">
                {[
                  { title: 'Match validé', time: '14:20', icon: Zap, color: 'text-accent' },
                  { title: 'Nouveau message', time: 'Hier', icon: MessageSquare, color: 'text-primary' },
                  { title: 'Compte certifié', time: 'Lundi', icon: ShieldCheck, color: 'text-secondary' },
                ].map((activity, i) => (
                  <div key={i} className="flex gap-5">
                    <div className={`h-10 w-10 rounded-xl ${activity.color} bg-current/5 flex items-center justify-center shrink-0`}>
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-neutral-900">{activity.title}</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
