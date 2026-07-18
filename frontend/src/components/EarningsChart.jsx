import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function EarningsChart({ monthlyBreakdown }) {
  if (!monthlyBreakdown?.length) return null

  const data = {
    labels: monthlyBreakdown.map(m => m.label),
    datasets: [{
      label: 'Approved Earnings (Rs)',
      data: monthlyBreakdown.map(m => m.total),
      backgroundColor: 'rgba(245,158,11,0.66)',
      borderColor: 'rgba(251,191,36,1)',
      borderWidth: 1,
      borderRadius: 8,
      borderSkipped: false,
      hoverBackgroundColor: 'rgba(251,191,36,0.82)'
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: 'rgba(148,163,184,0.18)',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        callbacks: { label: ctx => ` Rs ${ctx.parsed.y.toLocaleString()}` }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(148,163,184,0.08)' }, ticks: { color: '#94a3b8', font: { size: 12 } } },
      y: { grid: { color: 'rgba(148,163,184,0.08)' }, ticks: { color: '#94a3b8', font: { size: 12 }, callback: v => `Rs ${v.toLocaleString()}` }, beginAtZero: true }
    }
  }

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">Monthly earnings</h3>
          <p className="text-xs text-slate-500">Approved entries, last 6 months</p>
        </div>
      </div>
      <div style={{ height: 240 }}>
        <Bar data={data} options={options}/>
      </div>
    </div>
  )
}
