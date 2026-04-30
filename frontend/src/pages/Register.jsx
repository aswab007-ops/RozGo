import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { TrendingUp, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/register', form)
      toast.success('Registration successful!')
      setSuccess(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-gradient-to-br from-[#060b18] via-[#0d1526] to-[#060b18]">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={22} className="text-white"/>
          </div>
          <h1 className="text-2xl font-bold text-white">Create an account</h1>
          <p className="text-slate-400 text-sm mt-1">Start tracking your gig income today</p>
        </div>

        {success ? (
          <div className="card text-center py-8">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
            <p className="text-slate-400 text-sm mb-6">
              We've sent a verification link to <strong>{form.email}</strong>. Please click the link to verify your account before logging in.
            </p>
            <Link to="/login" className="btn-primary w-full block">Go to Login</Link>
          </div>
        ) : (
          <div className="card">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"/>
                  <input id="reg-name" type="text" placeholder="John Doe" required className="input-field pl-10"
                    value={form.name} onChange={set('name')}/>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"/>
                  <input id="reg-email" type="email" placeholder="you@example.com" required className="input-field pl-10"
                    value={form.email} onChange={set('email')}/>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"/>
                  <input id="reg-password" type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" required
                    className="input-field pl-10 pr-10" value={form.password} onChange={set('password')}/>
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>
              
              <button id="reg-submit" type="submit" disabled={loading} className="btn-primary w-full py-3 mt-1">
                {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Creating...</span> : 'Create Account'}
              </button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">Sign in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
