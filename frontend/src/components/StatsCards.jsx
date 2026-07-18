import { TrendingUp, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react'

const cards = [
  { key: 'totalEarnings',  label: 'Total Approved',   icon: TrendingUp,    color: 'amber', fmt: v => `Rs ${Number(v).toLocaleString()}` },
  { key: 'monthlyEarnings',label: 'This Month',        icon: Calendar,      color: 'cyan',  fmt: v => `Rs ${Number(v).toLocaleString()}` },
  { key: 'approvedCount',  label: 'Approved Entries',  icon: CheckCircle,   color: 'emerald',fmt: v => v },
  { key: 'pendingCount',   label: 'Pending Review',    icon: Clock,         color: 'amber',  fmt: v => v },
]

const colorMap = {
  amber:   { bg: 'bg-amber-400/10',   text: 'text-amber-300',   ring: 'ring-amber-400/25'   },
  cyan:    { bg: 'bg-cyan-400/10',    text: 'text-cyan-300',    ring: 'ring-cyan-400/25'    },
  emerald: { bg: 'bg-emerald-400/10', text: 'text-emerald-300', ring: 'ring-emerald-400/25' },
}

export default function StatsCards({ stats }) {
  if (!stats) return null
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, color, fmt }) => {
        const c = colorMap[color]
        return (
          <div key={key} className="metric-card">
            <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3 ring-1 ${c.ring}`}>
              <Icon size={18} className={c.text}/>
            </div>
            <p className="relative text-2xl font-bold text-white">{fmt(stats[key] ?? 0)}</p>
            <p className="relative text-xs text-slate-500 mt-1">{label}</p>
          </div>
        )
      })}
    </div>
  )
}
