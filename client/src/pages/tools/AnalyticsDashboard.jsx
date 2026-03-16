import { BarChart, TrendingUp, Users, Eye, MousePointerClick, RefreshCw } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler } from
'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsDashboard() {
  const metrics = [
  { label: 'Total Followers', value: '124.5K', change: '+12.5%', icon: Users, trend: 'up' },
  { label: 'Impressions', value: '2.1M', change: '+18.2%', icon: Eye, trend: 'up' },
  { label: 'Engagement Rate', value: '4.8%', change: '-0.5%', icon: MousePointerClick, trend: 'down' },
  { label: 'Profile Visits', value: '45.2K', change: '+8.4%', icon: TrendingUp, trend: 'up' }];


  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
    {
      label: 'Follower Growth',
      data: [65000, 72000, 85000, 92000, 105000, 115000, 124500],
      borderColor: '#10b981', // Brand color equivalent
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: '#10b981'
    }]

  };

  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
    {
      label: 'Post Reach',
      data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
      backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue
      borderRadius: 4
    },
    {
      label: 'Engagements',
      data: [2000, 3500, 2800, 5000, 4200, 6000, 5500],
      backgroundColor: 'rgba(139, 92, 246, 0.8)', // Purple
      borderRadius: 4
    }]

  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: 'var(--color-foreground)' }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
        ticks: { color: 'var(--color-muted-foreground)' }
      },
      y: {
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
        ticks: { color: 'var(--color-muted-foreground)' }
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 shrink-0">
                        <BarChart className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
                        <p className="text-muted-foreground">Monitor your social media growth and track engagement metrics.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="btn-secondary px-4 py-2 text-sm rounded-xl flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Refresh Data
                    </button>
                    <select className="bg-background border border-input text-foreground text-sm rounded-xl px-4 py-2 outline-none focus:border-brand-500 shadow-sm cursor-pointer">
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                        <option value="ytd">Year to Date</option>
                    </select>
                </div>
            </div>

            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {metrics.map((metric, i) =>
        <div key={i} className="glass-card rounded-2xl p-5 border border-border/30 hover:border-brand-500/30 transition-colors group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2.5 rounded-xl bg-background/50 text-muted-foreground group-hover:text-brand-500 group-hover:bg-brand-500/10 transition-colors">
                                <metric.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-md ${
            metric.trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`
            }>
                                {metric.change}
                            </span>
                        </div>
                        <div>
                            <h4 className="text-3xl font-black text-foreground mb-1">{metric.value}</h4>
                            <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                        </div>
                    </div>
        )}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="glass-card rounded-2xl p-6 border border-border/30">
                    <h3 className="font-bold text-foreground mb-6">Follower Growth (YTD)</h3>
                    <div className="h-[300px] w-full">
                        <Line data={lineChartData} options={chartOptions} />
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-border/30">
                    <h3 className="font-bold text-foreground mb-6">Reach & Engagement (Weekly)</h3>
                    <div className="h-[300px] w-full">
                        <Bar data={barChartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Top Performing Posts - Bottom Section */}
            <div className="mt-8 glass-card rounded-2xl p-6 border border-border/30">
                <h3 className="font-bold text-foreground mb-6">Top Performing Content</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-background/30">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-xl rounded-bl-xl font-bold">Content Snippet</th>
                                <th className="px-4 py-3 font-bold">Platform</th>
                                <th className="px-4 py-3 font-bold">Date Published</th>
                                <th className="px-4 py-3 font-bold">Impressions</th>
                                <th className="px-4 py-3 font-bold text-brand-500 rounded-tr-xl rounded-br-xl">Engagement</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-border/30 hover:bg-background/20 transition-colors">
                                <td className="px-4 py-4 font-medium text-foreground truncate max-w-[200px]">Just launched our new SaaS tool! 🚀</td>
                                <td className="px-4 py-4"><span className="px-2.5 py-1 rounded bg-[#1DA1F2]/10 text-[#1DA1F2] text-[10px] font-bold uppercase">Twitter</span></td>
                                <td className="px-4 py-4 text-muted-foreground">Mar 10, 2026</td>
                                <td className="px-4 py-4 font-semibold text-foreground">45,210</td>
                                <td className="px-4 py-4 font-bold text-green-500">8.4%</td>
                            </tr>
                            <tr className="border-b border-border/30 hover:bg-background/20 transition-colors">
                                <td className="px-4 py-4 font-medium text-foreground truncate max-w-[200px]">5 lessons I learned building a startup.</td>
                                <td className="px-4 py-4"><span className="px-2.5 py-1 rounded bg-[#0A66C2]/10 text-[#0A66C2] text-[10px] font-bold uppercase">LinkedIn</span></td>
                                <td className="px-4 py-4 text-muted-foreground">Mar 08, 2026</td>
                                <td className="px-4 py-4 font-semibold text-foreground">32,104</td>
                                <td className="px-4 py-4 font-bold text-green-500">6.2%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>);

}