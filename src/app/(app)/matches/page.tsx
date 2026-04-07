// src/app/(app)/matches/page.tsx
'use client'

import { useState } from 'react'
import { MOCK_MATCHES, MOCK_ITEMS } from '@/lib/mockData'
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
  
  const filteredMatches = MOCK_MATCHES.filter(match => {
    if (filterScore === 'HIGH') return match.score >= 70
    if (filterScore === 'MEDIUM') return match.score >= 40 && match.score < 70
    return true
  })

  // Group matches by source item (for demo purposes we only have one source item in mock)
  const groupedMatches = [
    {
      userItem: MOCK_ITEMS[0],
      matches: filteredMatches,
      bestScore: Math.max(...filteredMatches.map(m => m.score), 0)
    }
  ]

  return (
    <div className="bg-neutral-50 min-h-screen pb-20">
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
              <SelectTrigger className="w-[180px] bg-white border-neutral-200">
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
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                  <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-neutral-200">
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
