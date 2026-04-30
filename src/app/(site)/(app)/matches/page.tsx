// src/app/(app)/matches/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { fetchMatchesForUser, fetchMesObjets } from '@/lib/api'
import MatchCard from '@/components/matching/MatchCard'
import { Badge } from '@/components/ui/badge'
import { Zap, Filter, Search } from 'lucide-react'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function MatchesPage() {
  const [filterScore, setFilterScore] = useState('ALL')
  const [matches, setMatches] = useState<any[]>([])
  const [myItems, setMyItems] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    fetchMatchesForUser()
      .then((m) => { if (mounted) setMatches(m) })
      .catch(() => {})
    fetchMesObjets()
      .then((it) => { if (mounted) setMyItems(it) })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  const filteredMatches = matches.filter(match => {
    if (filterScore === 'HIGH') return match.score >= 70
    if (filterScore === 'MEDIUM') return match.score >= 40 && match.score < 70
    return true
  })

  // Group matches by source item (for demo purposes we only have one source item in mock)
  const groupedMatches = [
    {
      userItem: myItems[0] || null,
      matches: filteredMatches,
      bestScore: filteredMatches.length ? Math.max(...filteredMatches.map(m => m.score), 0) : 0,
    }
  ]

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
              <Zap className="h-8 w-8 text-accent fill-accent" />
              Vos correspondances
            </h1>
            <p className="text-neutral-500 mt-1">Découvrez les objets qui pourraient correspondre aux vôtres.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-neutral-500">Filtrer par score :</span>
            <Select value={filterScore} onValueChange={(val) => setFilterScore(val || 'ALL')}>
              <SelectTrigger className="w-[180px] bg-card border-border">
                <SelectValue placeholder="Tous les scores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les scores</SelectItem>
                <SelectItem value="HIGH">Score élevé (≥70%)</SelectItem>
                <SelectItem value="MEDIUM">Score moyen (40-69%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-12">
          {groupedMatches.map((group, idx) => (
            <section key={idx} className="space-y-6">
              <div className="flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center text-primary">
                    <Search className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">Pour votre annonce : "{group.userItem.title}"</h2>
                    <p className="text-sm text-neutral-500">{group.matches.length} correspondance{group.matches.length > 1 ? 's' : ''} trouvée{group.matches.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
                {group.matches.length > 0 && (
                  <Badge className="bg-secondary text-white px-4 py-1.5 rounded-full text-xs font-bold">
                    Meilleur score : {group.bestScore}%
                  </Badge>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {group.matches.length > 0 ? (
                  group.matches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-card rounded-2xl border border-dashed border-border">
                    <Zap className="h-12 w-12 text-neutral-200 mx-auto mb-4" />
                    <h3 className="font-bold text-neutral-900">Aucun match trouvé</h3>
                    <p className="text-sm text-neutral-500 mt-1">Revenez plus tard, notre algorithme continue de chercher !</p>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
