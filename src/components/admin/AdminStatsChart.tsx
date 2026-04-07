// src/components/admin/AdminStatsChart.tsx
'use client'

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

const data = [
  { name: 'Jan', lost: 400, found: 240, resolved: 180 },
  { name: 'Fév', lost: 300, found: 139, resolved: 120 },
  { name: 'Mar', lost: 200, found: 980, resolved: 600 },
  { name: 'Avr', lost: 278, found: 390, resolved: 300 },
  { name: 'Mai', lost: 189, found: 480, resolved: 420 },
  { name: 'Juin', lost: 239, found: 380, resolved: 350 },
]

export default function AdminStatsChart() {
  return (
    <div className="space-y-8">
      <div className="h-[300px] w-full">
        <h4 className="text-sm font-bold text-neutral-500 mb-4 uppercase tracking-wider">Évolution des signalements</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A32D2D" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#A32D2D" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorFound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0F6E56" stopOpacity={0.1}/>
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
          <BarChart data={data}>
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
