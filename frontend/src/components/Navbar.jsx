import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { TrendingUp, LayoutDashboard, PlusCircle, List, ShieldCheck, LogOut, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (path) => location.pathname === path

  const navLink = (to, label, Icon) => (
    <Link key={to} to={to} onClick={() => setOpen(false)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive(to) ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
      <Icon size={16}/>{label}
    </Link>
  )

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/6">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <TrendingUp size={16} className="text-white"/>
          </div>
          <span>Gig<span className="text-violet-400">Tracker</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {user ? (
            <>
              {user.role === 'worker' && navLink('/dashboard', 'Dashboard', LayoutDashboard)}
              {user.role === 'worker' && navLink('/add-earning', 'Add Earning', PlusCircle)}
              {user.role === 'worker' && navLink('/earnings', 'My Earnings', List)}
              {user.role === 'admin' && navLink('/admin', 'Admin Panel', ShieldCheck)}
              <div className="ml-3 flex items-center gap-3">
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10 transition-all">
                  <LogOut size={15}/>Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm px-4 py-2">Login</Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-2 ml-2">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-white/6 px-4 py-4 flex flex-col gap-2 glass-dark animate-fade-in">
          {user ? (
            <>
              {user.role === 'worker' && navLink('/dashboard', 'Dashboard', LayoutDashboard)}
              {user.role === 'worker' && navLink('/add-earning', 'Add Earning', PlusCircle)}
              {user.role === 'worker' && navLink('/earnings', 'My Earnings', List)}
              {user.role === 'admin' && navLink('/admin', 'Admin Panel', ShieldCheck)}
              <button onClick={() => { handleLogout(); setOpen(false) }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10 transition-all w-full">
                <LogOut size={15}/>Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary text-sm text-center">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-sm text-center">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
