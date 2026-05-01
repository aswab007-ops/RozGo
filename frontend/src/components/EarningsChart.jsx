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
      backgroundColor: 'rgba(139,92,246,0.5)',
      borderColor: 'rgba(139,92,246,1)',
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
      hoverBackgroundColor: 'rgba(139,92,246,0.75)'
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111d35',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        callbacks: { label: ctx => ` Rs ${ctx.parsed.y.toLocaleString()}` }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 12 } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 12 }, callback: v => `Rs ${v.toLocaleString()}` }, beginAtZero: true }
    }
  }

  return (
    <div className="card">
      <h3 className="text-base font-semibold text-white mb-4">Monthly Earnings (Last 6 Months)</h3>
      <div style={{ height: 240 }}>
        <Bar data={data} options={options}/>
      </div>
    </div>
  )
}
