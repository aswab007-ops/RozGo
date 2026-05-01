import { Link } from 'react-router-dom'
import { TrendingUp, ShieldCheck, BarChart3, FileDown, ArrowRight, CheckCircle } from 'lucide-react'

const features = [
  { icon: TrendingUp,  title: 'Track Earnings',       desc: 'Log every gig payment with source, date, and proof screenshot.' },
  { icon: ShieldCheck, title: 'Admin Verification',   desc: 'Admins review and approve/reject entries with optional feedback.' },
  { icon: BarChart3,   title: 'Visual Analytics',     desc: 'Monthly bar charts and stats to understand your income patterns.' },
  { icon: FileDown,    title: 'PDF Export',           desc: 'Download a clean income summary PDF for records or tax filing.' },
]

const steps = ['Register as a worker', 'Add income entry with proof', 'Admin verifies the entry', 'Track in your dashboard']

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060b18] via-[#0d1526] to-[#060b18]">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center max-w-4xl mx-auto animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-violet-400 mb-6">
          <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"/>
          Built for Gig Workers
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          Your Income,{' '}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Tracked & Verified
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          A structured platform for freelancers and gig workers to log earnings,
          upload proof, and get entries verified — with powerful dashboard analytics.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-3">
            Get Started Free <ArrowRight size={18}/>
          </Link>
          <Link to="/login" className="btn-secondary flex items-center justify-center gap-2 text-base px-8 py-3">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-3">Everything You Need</h2>
        <p className="text-center text-slate-400 mb-12">Purpose-built tools for independent income tracking</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card text-center group hover:border-violet-500/30 hover:scale-[1.03] transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-600/10 flex items-center justify-center mx-auto mb-4 group-hover:from-violet-600/30 transition-all">
                <Icon size={22} className="text-violet-400"/>
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
        <p className="text-slate-400 mb-12">Simple four-step process to get verified income records</p>
        <div className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <div key={i} className="glass flex items-center gap-4 px-6 py-4 text-left hover:border-violet-500/20 transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                {i + 1}
              </div>
              <span className="text-slate-200 font-medium">{step}</span>
              <CheckCircle size={16} className="text-emerald-400 ml-auto flex-shrink-0"/>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-base">
            Start Tracking <ArrowRight size={18}/>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/6 py-6 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} RozGo — Built for independent workers
      </footer>
    </div>
  )
}
