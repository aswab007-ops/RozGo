import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { DollarSign, Tag, Calendar, FileText, Upload, X, ArrowLeft } from 'lucide-react'

export default function AddEarning() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ amount: '', source: '', description: '', date: new Date().toISOString().split('T')[0] })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) return toast.error('File must be under 5MB')
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const removeFile = () => { setFile(null); setPreview(null) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) return toast.error('Enter a valid amount')
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (file) fd.append('proof', file)
      await axios.post('/api/earnings', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Earning added! Pending admin review.')
      navigate('/earnings')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add earning')
    } finally { setLoading(false) }
  }

  return (
    <div className="page-wrapper max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={16}/>Back
      </button>

      <div className="animate-slide-up">
        <h1 className="section-title">Add Earning Entry</h1>
        <p className="section-sub">Log a new income with proof. It will be reviewed by an admin.</p>

        <div className="card">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Amount */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Amount (₹) *</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"/>
                  <input id="earn-amount" type="number" min="1" step="0.01" placeholder="0.00" required
                    className="input-field pl-10" value={form.amount} onChange={set('amount')}/>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Date *</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"/>
                  <input id="earn-date" type="date" required className="input-field pl-10"
                    value={form.date} onChange={set('date')} max={new Date().toISOString().split('T')[0]}/>
                </div>
              </div>
            </div>

            {/* Source */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Income Source *</label>
              <div className="relative">
                <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"/>
                <input id="earn-source" type="text" placeholder="e.g. Uber, Freelance project, Delivery..." required
                  className="input-field pl-10" value={form.source} onChange={set('source')}/>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Description (optional)</label>
              <div className="relative">
                <FileText size={16} className="absolute left-3.5 top-3.5 text-slate-500"/>
                <textarea id="earn-desc" rows={3} placeholder="Brief description of the work done..."
                  className="input-field pl-10 resize-none" value={form.description} onChange={set('description')}/>
              </div>
            </div>

            {/* Proof upload */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Proof Screenshot (optional)</label>
              {preview ? (
                <div className="relative rounded-xl overflow-hidden border border-white/10">
                  <img src={preview} alt="proof" className="w-full max-h-48 object-cover"/>
                  <button type="button" onClick={removeFile}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-rose-600 transition-colors">
                    <X size={14}/>
                  </button>
                </div>
              ) : (
                <label id="earn-upload" htmlFor="file-input"
                  className="flex flex-col items-center justify-center gap-2 w-full h-28 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-all">
                  <Upload size={22} className="text-slate-500"/>
                  <span className="text-sm text-slate-500">Click to upload image (max 5MB)</span>
                  <input id="file-input" type="file" accept="image/*" className="hidden" onChange={handleFile}/>
                </label>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
              <button id="earn-submit" type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Uploading...</span> : 'Submit Entry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
