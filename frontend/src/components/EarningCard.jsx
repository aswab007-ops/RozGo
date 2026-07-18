import { DollarSign, Calendar, Tag, CheckCircle, Clock, XCircle, Trash2, Image } from 'lucide-react'

const statusConfig = {
  pending:  { label: 'Pending',  cls: 'badge-pending',  Icon: Clock },
  approved: { label: 'Approved', cls: 'badge-approved', Icon: CheckCircle },
  rejected: { label: 'Rejected', cls: 'badge-rejected', Icon: XCircle }
}

export default function EarningCard({ earning, onDelete }) {
  const cfg = statusConfig[earning.status]
  const Icon = cfg.Icon

  return (
    <div className="card group animate-fade-in">
      <div className="flex justify-between items-start gap-4">
        {/* Amount */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <DollarSign size={18} className="text-amber-300"/>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">Rs {earning.amount.toLocaleString()}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Tag size={11}/>{earning.source}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Calendar size={11}/>{new Date(earning.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
              </span>
            </div>
            {earning.description && <p className="text-xs text-slate-500 mt-1.5">{earning.description}</p>}
          </div>
        </div>
        {/* Status + delete */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className={cfg.cls}><Icon size={11}/>{cfg.label}</span>
          {earning.status !== 'approved' && onDelete && (
            <button onClick={() => onDelete(earning._id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10">
              <Trash2 size={14}/>
            </button>
          )}
        </div>
      </div>

      {/* Proof image */}
      {earning.imageUrl && (
        <div className="mt-3 pt-3 border-t border-slate-800">
          <a href={earning.imageUrl} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 text-xs text-amber-300 hover:text-amber-200 transition-colors">
            <Image size={13}/>View Proof
          </a>
        </div>
      )}

      {/* Admin comment */}
      {earning.adminComment && (
        <div className="mt-3 pt-3 border-t border-slate-800">
          <p className="text-xs text-slate-400"><span className="text-slate-300 font-medium">Admin note:</span> {earning.adminComment}</p>
        </div>
      )}
    </div>
  )
}
