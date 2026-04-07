// src/components/matching/MatchScoreBar.tsx
import { Badge } from '@/components/ui/badge'

export default function MatchScoreBar({ score, keywords }: { score: number, keywords?: string[] }) {
  const getColor = () => {
    if (score >= 70) return 'bg-secondary'
    if (score >= 40) return 'bg-accent'
    return 'bg-neutral-400'
  }

  const getLabel = () => {
    if (score >= 70) return 'Très bonne correspondance'
    if (score >= 40) return 'Correspondance moyenne'
    return 'Faible correspondance'
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className={`text-xs font-bold uppercase tracking-wider ${score >= 70 ? 'text-secondary' : score >= 40 ? 'text-accent' : 'text-neutral-500'}`}>
          {getLabel()}
        </span>
        <span className="text-sm font-bold">{score}%</span>
      </div>
      <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${getColor()}`} 
          style={{ width: `${score}%` }}
        />
      </div>
      {keywords && keywords.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {keywords.map((kw, i) => (
            <Badge key={i} variant="outline" className="text-[10px] py-0 px-1.5 border-neutral-200 text-neutral-500 font-normal">
              {kw}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
