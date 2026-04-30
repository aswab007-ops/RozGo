import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import EarningCard from '../components/EarningCard'
import { Link } from 'react-router-dom'
import { PlusCircle, Search, Filter } from 'lucide-react'

const FILTERS = ['all', 'pending', 'approved', 'rejected']

export default function MyEarnings() {
  const [earnings, setEarnings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')

  const fetchEarnings = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/earnings')
      setEarnings(data.earnings)
    } catch { toast.error('Failed to load earnings') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchEarnings() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this earning entry?')) return
    try {
      await axios.delete(`/api/earnings/${id}`)
      setEarnings(p => p.filter(e => e._id !== id))
      toast.success('Entry deleted')
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed') }
  }

  const filtered = earnings
    .filter(e => filter === 'all' || e.status === filter)
    .filter(e => !search || e.source.toLowerCase().includes(search.toLowerCase()) || e.description?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="page-wrapper max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-fade-in">
        <div>
          <h1 className="section-title">My Earnings</h1>
          <p className="text-slate-400 text-sm">{earnings.length} total entries</p>
        </div>
        <Link to="/add-earning" className="btn-primary flex items-center gap-2 text-sm py-2 px-4 self-start sm:self-auto">
          <PlusCircle size={15}/>Add Earning
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"/>
          <input type="text" placeholder="Search by source or description..."
            className="input-field pl-10 py-2.5 text-sm" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all
                ${filter === f ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/8 border border-transparent'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16 animate-fade-in">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-slate-400">No earnings found</p>
          <Link to="/add-earning" className="btn-primary inline-flex items-center gap-2 mt-4 text-sm">
            <PlusCircle size={15}/>Add your first entry
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 animate-slide-up">
          {filtered.map(e => <EarningCard key={e._id} earning={e} onDelete={handleDelete}/>)}
        </div>
      )}
    </div>
  )
}
