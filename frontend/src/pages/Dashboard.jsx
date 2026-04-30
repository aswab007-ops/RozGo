import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import StatsCards from '../components/StatsCards'
import EarningsChart from '../components/EarningsChart'
import { Link } from 'react-router-dom'
import { PlusCircle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/earnings/stats')
      setStats(data)
    } catch { toast.error('Failed to load stats') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchStats() }, [])

  const downloadPDF = async () => {
    try {
      const { data } = await axios.get('/api/earnings')
      const doc = new jsPDF()
      doc.setFontSize(18)
      doc.setTextColor(40)
      doc.text('GigTracker — Income Summary', 14, 22)
      doc.setFontSize(11)
      doc.setTextColor(100)
      doc.text(`Worker: ${user.name}  |  Generated: ${new Date().toLocaleDateString()}`, 14, 30)

      autoTable(doc, {
        startY: 38,
        head: [['Date', 'Source', 'Amount (₹)', 'Status']],
        body: data.earnings.map(e => [
          new Date(e.date).toLocaleDateString('en-IN'),
          e.source,
          `₹${e.amount.toLocaleString()}`,
          e.status.toUpperCase()
        ]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [139, 92, 246] }
      })

      const total = data.earnings.filter(e => e.status === 'approved').reduce((s, e) => s + e.amount, 0)
      doc.text(`Total Approved: ₹${total.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 10)
      doc.save(`GigTracker_${user.name}_${Date.now()}.pdf`)
      toast.success('PDF downloaded!')
    } catch { toast.error('Failed to generate PDF') }
  }

  return (
    <div className="page-wrapper max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="text-slate-400 text-sm">Welcome back, <span className="text-violet-400 font-medium">{user?.name}</span></p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={fetchStats} className="btn-secondary flex items-center gap-2 text-sm py-2 px-4">
            <RefreshCw size={14}/>Refresh
          </button>
          <button onClick={downloadPDF} className="btn-secondary flex items-center gap-2 text-sm py-2 px-4">
            📄 Export PDF
          </button>
          <Link to="/add-earning" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
            <PlusCircle size={15}/>Add Earning
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-slide-up">
          <StatsCards stats={stats}/>
          <EarningsChart monthlyBreakdown={stats?.monthlyBreakdown}/>

          {/* Status breakdown */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Approved Entries', val: stats?.approvedCount ?? 0, color: 'emerald' },
              { label: 'Pending Review',   val: stats?.pendingCount  ?? 0, color: 'amber'   },
              { label: 'Rejected Entries', val: stats?.rejectedCount ?? 0, color: 'rose'    },
            ].map(({ label, val, color }) => (
              <div key={label} className="card text-center">
                <p className={`text-3xl font-bold text-${color}-400 mb-1`}>{val}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="card text-center py-8">
            <p className="text-slate-400 text-sm mb-4">Keep your earnings up to date</p>
            <Link to="/add-earning" className="btn-primary inline-flex items-center gap-2">
              <PlusCircle size={16}/>Log New Earning
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
