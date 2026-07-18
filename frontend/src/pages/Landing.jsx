import { Link } from 'react-router-dom'
import { TrendingUp, ShieldCheck, BarChart3, FileDown, ArrowRight, CheckCircle, WalletCards, ReceiptText } from 'lucide-react'

const features = [
  { icon: TrendingUp, title: 'Track Earnings', desc: 'Log every gig payment with source, date, notes, and optional proof.' },
  { icon: ShieldCheck, title: 'Admin Verification', desc: 'Admins approve or reject entries with a clear review trail.' },
  { icon: BarChart3, title: 'Visual Analytics', desc: 'See monthly totals and status counts without spreadsheet cleanup.' },
  { icon: FileDown, title: 'PDF Export', desc: 'Download a clean income summary for records or tax filing.' },
]

const steps = ['Register as a worker', 'Add income entry with proof', 'Admin verifies the entry', 'Track it in your dashboard']

export default function Landing() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div className="animate-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold text-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              Verified income records for independent workers
            </div>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.98] text-white md:text-6xl">
              Turn scattered gig payments into trusted income history.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              RozGo helps workers log earnings, attach proof, and move each entry through admin verification so the dashboard stays clean, usable, and export-ready.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="btn-primary text-base px-8 py-3">
                Get Started Free <ArrowRight size={18}/>
              </Link>
              <Link to="/login" className="btn-secondary text-base px-8 py-3">
                Sign In
              </Link>
            </div>
          </div>

          <div className="relative animate-slide-up">
            <div className="absolute -inset-6 rounded-[2rem] bg-amber-400/10 blur-3xl" />
            <div className="relative rounded-2xl border border-slate-700/80 bg-slate-950/75 p-4">
              <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <p className="text-xs text-slate-500">Approved balance</p>
                  <p className="text-3xl font-bold text-white">Rs 124,800</p>
                </div>
                <div className="rounded-xl bg-amber-400 px-3 py-2 text-sm font-bold text-slate-950">Verified</div>
              </div>
              <div className="grid gap-3">
                {[
                  ['Freelance project', 'Rs 38,500', 'approved'],
                  ['Ride share', 'Rs 12,900', 'pending'],
                  ['Delivery shift', 'Rs 7,450', 'approved'],
                ].map(([source, amount, status]) => (
                  <div key={source} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-amber-300">
                        <ReceiptText size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{source}</p>
                        <p className="text-xs capitalize text-slate-500">{status}</p>
                      </div>
                    </div>
                    <p className="font-bold text-slate-100">{amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          <div className="surface-ring p-6 md:col-span-2">
            <WalletCards className="mb-5 text-amber-300" size={26} />
            <h2 className="max-w-xl text-3xl font-bold text-white">A record that survives messy work weeks.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Upload proof when you have it, leave it blank when you do not, and keep every entry tied to a review state.
            </p>
          </div>
          <div className="surface-ring p-6">
            <p className="text-sm text-slate-500">Current flow</p>
            <p className="mt-2 text-4xl font-bold text-amber-300">4 steps</p>
            <p className="mt-3 text-sm text-slate-400">From registration to reviewed earnings.</p>
          </div>
        </div>
      </section>

      <section className="py-14 px-4 max-w-6xl mx-auto">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-bold text-white">Built around the earning entry</h2>
            <p className="mt-2 text-slate-400">Every screen supports one job: capture income clearly and verify it quickly.</p>
          </div>
          <Link to="/register" className="btn-secondary w-fit">Create account <ArrowRight size={16}/></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="surface-ring p-5 transition-all duration-200 hover:-translate-y-1 hover:border-amber-400/35">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                <Icon size={21}/>
              </div>
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-400 leading-6">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 px-4 max-w-4xl mx-auto">
        <div className="card">
          <h2 className="text-3xl font-bold text-white mb-3">How it works</h2>
          <p className="text-slate-400 mb-8">The sequence is intentionally simple because workers should not need training to submit proof.</p>
          <div className="grid gap-3">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/35 px-5 py-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-300 text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <span className="text-slate-200 font-medium">{step}</span>
                <CheckCircle size={16} className="text-emerald-300 ml-auto flex-shrink-0"/>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/register" className="btn-primary px-8 py-3 text-base">
              Start Tracking <ArrowRight size={18}/>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} RozGo — Built for independent workers
      </footer>
    </div>
  )
}
