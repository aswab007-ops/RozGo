import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/admin/login', form)
      login(data.user, data.token)
      toast.success('Admin login successful')
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Admin login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={22} className="text-white"/>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-rose-400 text-sm mt-1 font-medium">Restricted Access</p>
        </div>

        <div className="card border-rose-500/20">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Admin Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"/>
                <input id="admin-email" type="email" placeholder="admin@example.com" required
                  className="input-field pl-10 focus:border-rose-500" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}/>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"/>
                <input id="admin-password" type={showPw ? 'text' : 'password'} placeholder="••••••••" required
                  className="input-field pl-10 pr-10 focus:border-rose-500" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}/>
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <button id="admin-submit" type="submit" disabled={loading} 
              className="btn-danger px-6 py-3 mt-1 w-full">
              {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Authenticating...</span> : 'Secure Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
