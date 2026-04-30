import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Clock, User, Calendar, DollarSign, Image, ChevronDown, ChevronUp } from 'lucide-react'

const statusCls = { pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected' }
const statusIcon = { pending: Clock, approved: CheckCircle, rejected: XCircle }

function AdminCard({ earning, onReview }) {
  const [open, setOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const Icon = statusIcon[earning.status]

  const review = async (status) => {
    setLoading(true)
    try {
      await onReview(earning._id, status, comment)
      setOpen(false)
    } finally { setLoading(false) }
  }

  return (
    <div className="card animate-fade-in hover:border-white/14 transition-all">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/15 flex items-center justify-center flex-shrink-0">
            <DollarSign size={18} className="text-violet-400"/>
          </div>
          <div>
            <p className="text-xl font-bold text-white">₹{earning.amount.toLocaleString()}</p>
            <p className="text-sm text-slate-400 mt-0.5">{earning.source}</p>
            <div className="flex flex-wrap gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-xs text-slate-500"><User size={11}/>{earning.userId?.name || 'Unknown'} ({earning.userId?.email})</span>
              <span className="flex items-center gap-1 text-xs text-slate-500"><Calendar size={11}/>{new Date(earning.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
            </div>
            {earning.description && <p className="text-xs text-slate-500 mt-1">{earning.description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={statusCls[earning.status]}><Icon size={11}/>{earning.status}</span>
          {earning.status === 'pending' && (
            <button onClick={() => setOpen(!open)}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-white/5 transition-all">
              {open ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            </button>
          )}
        </div>
      </div>

      {/* Proof link */}
      {earning.imageUrl && (
        <div className="mt-3 pt-3 border-t border-white/6">
          <a href={earning.imageUrl} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 transition-colors">
            <Image size={12}/>View Proof Screenshot
          </a>
        </div>
      )}

      {/* Admin panel */}
      {open && earning.status === 'pending' && (
        <div className="mt-4 pt-4 border-t border-white/6 flex flex-col gap-3 animate-fade-in">
          <textarea rows={2} placeholder="Optional comment for the worker..."
            className="input-field resize-none text-sm" value={comment}
            onChange={e => setComment(e.target.value)}/>
          <div className="flex gap-3">
            <button onClick={() => review('approved')} disabled={loading}
              className="btn-success flex items-center gap-2 flex-1 justify-center text-sm">
              <CheckCircle size={15}/>{loading ? 'Processing...' : 'Approve'}
            </button>
            <button onClick={() => review('rejected')} disabled={loading}
              className="btn-danger flex items-center gap-2 flex-1 justify-center text-sm">
              <XCircle size={15}/>{loading ? 'Processing...' : 'Reject'}
            </button>
          </div>
        </div>
      )}

      {/* Show existing comment */}
      {earning.adminComment && earning.status !== 'pending' && (
        <div className="mt-3 pt-3 border-t border-white/6">
          <p className="text-xs text-slate-400"><span className="text-slate-300 font-medium">Your comment:</span> {earning.adminComment}</p>
        </div>
      )}
    </div>
  )
}

const FILTERS = ['all', 'pending', 'approved', 'rejected']

export default function AdminPanel() {
  const [earnings, setEarnings] = useState([])
  const [stats, setStats]       = useState(null)
  const [filter, setFilter]     = useState('pending')
  const [loading, setLoading]   = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [earRes, stRes] = await Promise.all([
        axios.get(`/api/admin/earnings${filter !== 'all' ? `?status=${filter}` : ''}`),
        axios.get('/api/admin/stats')
      ])
      setEarnings(earRes.data.earnings)
      setStats(stRes.data)
    } catch { toast.error('Failed to load admin data') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [filter])

  const handleReview = async (id, status, comment) => {
    try {
      const { data } = await axios.patch(`/api/admin/earnings/${id}`, { status, adminComment: comment })
      setEarnings(p => p.map(e => e._id === id ? data.earning : e))
      toast.success(`Entry ${status} successfully`)
    } catch { toast.error('Review failed') }
  }

  return (
    <div className="page-wrapper max-w-5xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="section-title">Admin Panel</h1>
        <p className="text-slate-400 text-sm">Review and verify submitted earnings</p>
      </div>

      {/* Admin stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-slide-up">
          {[
            { label: 'Total Entries',    val: stats.total,    color: 'violet' },
            { label: 'Pending',          val: stats.pending,  color: 'amber'  },
            { label: 'Approved',         val: stats.approved, color: 'emerald'},
            { label: 'Total Approved ₹', val: `₹${stats.totalAmount?.toLocaleString() || 0}`, color: 'cyan' },
          ].map(({ label, val, color }) => (
            <div key={label} className="card text-center">
              <p className={`text-2xl font-bold text-${color}-400 mb-1`}>{val}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap animate-fade-in">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all
              ${filter === f ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/8 border border-transparent'}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : earnings.length === 0 ? (
        <div className="card text-center py-16 animate-fade-in">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-slate-400">No {filter === 'all' ? '' : filter} entries found</p>
        </div>
      ) : (
        <div className="grid gap-4 animate-slide-up">
          {earnings.map(e => <AdminCard key={e._id} earning={e} onReview={handleReview}/>)}
        </div>
      )}
    </div>
  )
}
