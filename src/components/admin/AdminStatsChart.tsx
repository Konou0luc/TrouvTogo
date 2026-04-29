// src/components/admin/AdminStatsChart.tsx
'use client'

import { useEffect, useState } from 'react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts'
import { fetchObjetsPage, fetchStatsTimeseries } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'

type SeriesPoint = { name: string; lost: number; found: number; resolved: number }

function monthsRange(count = 6) {
  const res: { key: string; label: string; date: Date }[] = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleString('fr-FR', { month: 'short' })
    res.push({ key, label, date: d })
  }
  return res
}

export default function AdminStatsChart() {
  const [loading, setLoading] = useState(true)
  const [series, setSeries] = useState<SeriesPoint[]>([])

  useEffect(() => {
    let mounted = true

    async function load() {
      setLoading(true)
      try {
        // Prefer backend timeseries endpoint if available
        try {
          const ts = await fetchStatsTimeseries(6)
          if (ts && Array.isArray(ts) && ts.length > 0) {
            setSeries(ts.map((t) => ({ name: t.name, lost: t.lost, found: t.found, resolved: t.resolved })))
            setLoading(false)
            return
          }
        } catch (err) {
          // fallback to client-side aggregation below
        }

        // fallback: aggregate client-side from objets (works if backend endpoint not present)
        const pageSize = 2000
        const res = await fetchObjetsPage({ page: 0, size: pageSize })
        if (!mounted) return

        const items = res.items || []

        const months = monthsRange(6)
        const map: Record<string, SeriesPoint> = {}
        months.forEach((m) => (map[m.key] = { name: m.label, lost: 0, found: 0, resolved: 0 }))

        items.forEach((it) => {
          const d = new Date(it.createdAt)
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
          if (!(key in map)) return
          if (it.type === 'LOST') map[key].lost += 1
          else map[key].found += 1
          if (it.status === 'RESOLVED') map[key].resolved += 1
        })

        const arr = months.map((m) => map[m.key])
        setSeries(arr)
      } catch (e) {
        setSeries([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-[300px] w-full">
          <h4 className="text-sm font-bold text-neutral-500 mb-4 uppercase tracking-wider">Évolution des signalements</h4>
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
        <div className="h-[300px] w-full">
          <h4 className="text-sm font-bold text-neutral-500 mb-4 uppercase tracking-wider">Taux de résolution</h4>
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="h-[300px] w-full">
        <h4 className="text-sm font-bold text-neutral-500 mb-4 uppercase tracking-wider">Évolution des signalements</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series}>
            <defs>
              <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A32D2D" stopOpacity={0.12}/>
                <stop offset="95%" stopColor="#A32D2D" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorFound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0F6E56" stopOpacity={0.12}/>
                <stop offset="95%" stopColor="#0F6E56" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1EFE8" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#888780' }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#888780' }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Area type="monotone" dataKey="lost" stroke="#A32D2D" fillOpacity={1} fill="url(#colorLost)" strokeWidth={3} />
            <Area type="monotone" dataKey="found" stroke="#0F6E56" fillOpacity={1} fill="url(#colorFound)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[300px] w-full">
        <h4 className="text-sm font-bold text-neutral-500 mb-4 uppercase tracking-wider">Taux de résolution</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={series}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1EFE8" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: '#F8F7F4' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
            <Legend verticalAlign="top" align="right" height={36} />
            <Bar dataKey="resolved" fill="#185FA5" radius={[4, 4, 0, 0]} name="Objets restitués" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
