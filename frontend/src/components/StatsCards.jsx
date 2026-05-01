import { TrendingUp, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react'

const cards = [
  { key: 'totalEarnings',  label: 'Total Approved',   icon: TrendingUp,    color: 'violet', fmt: v => `Rs ${Number(v).toLocaleString()}` },
  { key: 'monthlyEarnings',label: 'This Month',        icon: Calendar,      color: 'cyan',   fmt: v => `Rs ${Number(v).toLocaleString()}` },
  { key: 'approvedCount',  label: 'Approved Entries',  icon: CheckCircle,   color: 'emerald',fmt: v => v },
  { key: 'pendingCount',   label: 'Pending Review',    icon: Clock,         color: 'amber',  fmt: v => v },
]

const colorMap = {
  violet:  { bg: 'bg-violet-600/15',  text: 'text-violet-400',  ring: 'ring-violet-500/30'  },
  cyan:    { bg: 'bg-cyan-600/15',    text: 'text-cyan-400',    ring: 'ring-cyan-500/30'    },
  emerald: { bg: 'bg-emerald-600/15', text: 'text-emerald-400', ring: 'ring-emerald-500/30' },
  amber:   { bg: 'bg-amber-600/15',   text: 'text-amber-400',   ring: 'ring-amber-500/30'   },
}

export default function StatsCards({ stats }) {
  if (!stats) return null
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, color, fmt }) => {
        const c = colorMap[color]
        return (
          <div key={key} className="card hover:scale-[1.02] transition-transform duration-200">
            <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3 ring-1 ${c.ring}`}>
              <Icon size={18} className={c.text}/>
            </div>
            <p className="text-2xl font-bold text-white">{fmt(stats[key] ?? 0)}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        )
      })}
    </div>
  )
}
