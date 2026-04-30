import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function VerifyEmail() {
  const { token } = useParams()
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.get(`/api/auth/verify-email/${token}`)
        setStatus('success')
        setMessage(data.message)
      } catch (err) {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Verification failed')
      }
    }
    verify()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#060b18] via-[#0d1526] to-[#060b18]">
      <div className="w-full max-w-md animate-slide-up">
        <div className="card text-center py-10">
          {status === 'loading' && (
            <>
              <Loader2 size={48} className="text-violet-500 animate-spin mx-auto mb-4" />
              <h1 className="text-xl font-bold text-white mb-2">Verifying your email...</h1>
              <p className="text-slate-400 text-sm">Please wait a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h1 className="text-xl font-bold text-white mb-2">Email Verified!</h1>
              <p className="text-slate-400 text-sm mb-6">{message}</p>
              <Link to="/login" className="btn-primary inline-block">Go to Login</Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle size={32} />
              </div>
              <h1 className="text-xl font-bold text-white mb-2">Verification Failed</h1>
              <p className="text-slate-400 text-sm mb-6">{message}</p>
              <Link to="/register" className="btn-secondary inline-block mr-3">Sign Up Again</Link>
              <Link to="/login" className="btn-primary inline-block">Go to Login</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
