import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { TrendingUp, ShieldCheck, BarChart3, FileDown, ArrowRight, CheckCircle, WalletCards, ReceiptText, Sparkles } from 'lucide-react'
import { FloatingBadge, MagneticButton, Reveal, SplitText, TiltCard } from '../components/MotionFX'

const features = [
  { icon: TrendingUp, title: 'Track Earnings', desc: 'Log every gig payment with source, date, notes, and optional proof.' },
  { icon: ShieldCheck, title: 'Admin Verification', desc: 'Admins approve or reject entries with a clear review trail.' },
  { icon: BarChart3, title: 'Visual Analytics', desc: 'See monthly totals and status counts without spreadsheet cleanup.' },
  { icon: FileDown, title: 'PDF Export', desc: 'Download a clean income summary for records or tax filing.' },
]

const entries = [
  ['Freelance project', 'Rs 38,500', 'approved'],
  ['Ride share', 'Rs 12,900', 'pending'],
  ['Delivery shift', 'Rs 7,450', 'approved'],
]

const steps = ['Register as a worker', 'Add income entry with proof', 'Admin verifies the entry', 'Track it in your dashboard']

export default function Landing() {
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, -90])
  const visualRotate = useTransform(scrollYProgress, [0, 0.35], [0, -7])
  const visualScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.93])

  return (
    <div className="min-h-screen overflow-hidden">
      <section className="relative min-h-screen px-4 pt-32 pb-20">
        <motion.div style={{ y: heroY }} className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.02fr_.98fr]">
          <div className="relative z-10">
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-slate-950/35 px-4 py-1.5 text-xs font-semibold text-amber-200 backdrop-blur-md"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <Sparkles size={14} />
              Verified income records for independent workers
            </motion.div>

            <h1 className="hero-headline max-w-4xl text-5xl font-extrabold leading-[0.96] text-white md:text-7xl">
              <SplitText text="Turn scattered gig payments into trusted income history." />
            </h1>

            <Reveal delay={0.35}>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
                RozGo turns messy work weeks into verified income records with proof uploads, admin review, analytics, and clean exports.
              </p>
            </Reveal>

            <Reveal delay={0.45} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <MagneticButton as={Link} to="/register" className="bg-amber-400 text-slate-950">
                Get Started Free <ArrowRight size={18}/>
              </MagneticButton>
              <MagneticButton as={Link} to="/login" className="border border-slate-700/70 bg-slate-950/60 text-slate-100">
                Sign In
              </MagneticButton>
            </Reveal>
          </div>

          <motion.div style={{ rotate: visualRotate, scale: visualScale }} className="relative min-h-[34rem]">
            <FloatingBadge className="-left-2 top-10 z-20 px-4 py-2 text-xs font-semibold text-emerald-200" delay={0.1}>
              <span className="inline-flex items-center gap-2"><CheckCircle size={14}/> verified proof</span>
            </FloatingBadge>
            <FloatingBadge className="right-0 top-28 z-20 px-4 py-2 text-xs font-semibold text-amber-200" delay={0.8}>
              Rs 124,800 approved
            </FloatingBadge>

            <TiltCard className="absolute inset-x-0 top-8 mx-auto max-w-md">
              <div className="relative z-10 rounded-[1.35rem] border border-slate-700/70 bg-slate-950/55 p-5 backdrop-blur-lg">
                <svg className="pointer-events-none absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)]" viewBox="0 0 460 520" fill="none">
                  <rect className="outline-trace" x="2" y="2" width="456" height="516" rx="28" stroke="rgba(251,191,36,.58)" strokeWidth="2" />
                </svg>
                <div className="relative mb-5 flex items-center justify-between border-b border-slate-800 pb-5">
                  <div>
                    <p className="text-xs text-slate-500">Approved balance</p>
                    <p className="text-4xl font-bold text-white">Rs 124,800</p>
                  </div>
                  <div className="rounded-xl bg-amber-400 px-3 py-2 text-sm font-bold text-slate-950">Live</div>
                </div>
                <div className="relative grid gap-3">
                  {entries.map(([source, amount, status], index) => (
                    <motion.div
                      key={source}
                      className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm"
                      initial={{ opacity: 0, x: 36 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 + index * 0.12, type: 'spring', stiffness: 180, damping: 20 }}
                      whileHover={{ x: 8, scale: 1.015 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-amber-300 transition-transform group-hover:rotate-6 group-hover:scale-110">
                          <ReceiptText size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{source}</p>
                          <p className="text-xs capitalize text-slate-500">{status}</p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-100">{amount}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative px-4 py-24">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          <Reveal className="md:col-span-2">
            <TiltCard>
              <div className="glass p-8">
                <WalletCards className="mb-6 text-amber-300" size={30} />
                <h2 className="max-w-xl text-4xl font-bold text-white">A record that survives messy work weeks.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                  Proof, status, totals, and exports all stay attached to the same earning entry. No extra dashboards. No manual reconciliation.
                </p>
              </div>
            </TiltCard>
          </Reveal>
          <Reveal delay={0.12}>
            <TiltCard depth={8}>
              <div className="glass p-8">
                <p className="text-sm text-slate-500">Review flow</p>
                <p className="mt-3 text-5xl font-bold text-amber-300">4</p>
                <p className="mt-4 text-sm text-slate-400">Simple states from submission to approval.</p>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      <section className="relative px-4 py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-4xl font-bold text-white">Built around the earning entry</h2>
              <p className="mt-3 text-slate-400">Every interaction supports one job: capture income clearly and verify it quickly.</p>
            </div>
            <MagneticButton as={Link} to="/register" className="w-fit border border-slate-700 bg-slate-950/70 text-slate-100">
              Create account <ArrowRight size={16}/>
            </MagneticButton>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc }, index) => (
              <Reveal key={title} delay={index * 0.07}>
                <TiltCard depth={9}>
                  <div className="glass min-h-[15rem] p-6">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                      <Icon size={22}/>
                    </div>
                    <h3 className="font-semibold text-white">{title}</h3>
                    <p className="mt-3 text-sm text-slate-400 leading-6">{desc}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[180vh] px-4 py-24">
        <div className="sticky top-28 mx-auto max-w-4xl">
          <Reveal>
            <div className="glass p-7 md:p-10">
              <h2 className="text-4xl font-bold text-white mb-3">Scroll through the verification path</h2>
              <p className="text-slate-400 mb-8">The workflow stays cinematic here, but boring where it matters: inside forms and admin review.</p>
              <div className="grid gap-4">
                {steps.map((step, i) => (
                  <motion.div
                    key={step}
                    className="relative flex items-center gap-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40 px-5 py-4"
                    initial={{ opacity: 0, x: i % 2 ? 60 : -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.55 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                    whileHover={{ scale: 1.018, x: 8 }}
                  >
                    <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-300 to-cyan-300 opacity-80" />
                    <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-300 text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-slate-200 font-medium">{step}</span>
                    <CheckCircle size={16} className="text-emerald-300 ml-auto flex-shrink-0"/>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <MagneticButton as={Link} to="/register" className="bg-amber-400 text-slate-950">
                  Start Tracking <ArrowRight size={18}/>
                </MagneticButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-slate-800/70 py-7 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} RozGo — Built for independent workers
      </footer>
    </div>
  )
}
