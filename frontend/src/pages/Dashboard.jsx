import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Loader2, AlertCircle, Calendar } from 'lucide-react';
import api from '../utils/api';
import StatCard from '../components/StatCard';
import StatusStub from '../components/StatusStub';
import { formatDate } from '../utils/date';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  Wishlist: '#C9CFDB',
  Applied: '#FCE5BC',
  'Phone Screen': '#F2A93B',
  Interviewing: '#F2A93B',
  Offer: '#2DD4BF',
  Accepted: '#15A395',
  Rejected: '#FB6F5C',
  Withdrawn: '#7C879B',
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: res } = await api.get('/analytics/summary');
        setData(res);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={28} className="animate-spin text-amber" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-8">
        <div className="flex items-center gap-2 bg-coral-light text-coral-dark text-sm rounded-lg p-3">
          <AlertCircle size={16} />
          {error}
        </div>
      </div>
    );
  }

  if (data.total === 0) {
    return (
      <div className="px-4 sm:px-8 py-10 sm:py-16 flex flex-col items-center text-center max-w-md mx-auto">
        <h1 className="font-display text-2xl font-semibold text-ink mb-2">No applications yet</h1>
        <p className="text-sm text-slate-dark mb-6">
          Add your first internship application to start seeing your pipeline take shape here.
        </p>
        <button
          onClick={() => navigate('/pipeline?new=1')}
          className="bg-ink text-paper font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-ink-light transition-colors"
        >
          Add an application
        </button>
      </div>
    );
  }

  const statusChartData = Object.entries(data.byStatus)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({ status, count, fill: STATUS_COLORS[status] || '#7C879B' }));

  const roundsChartData = Object.entries(data.roundsByType || {}).map(([type, count]) => ({
    type,
    count,
  }));

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-[1400px]">
      <div className="mb-7">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">Dashboard</h1>
        <p className="text-sm text-slate-dark mt-1">Your internship hunt, by the numbers.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Total applications" value={data.total} accent="ink" />
        <StatCard
          label="Response rate"
          value={`${data.rates.responseRate}%`}
          sublabel="Moved past 'Applied'"
          accent="amber"
        />
        <StatCard
          label="Interview rate"
          value={`${data.rates.interviewConversionRate}%`}
          sublabel="Reached an interview"
          accent="amber"
        />
        <StatCard
          label="Offer rate"
          value={`${data.rates.overallSuccessRate}%`}
          sublabel="Of all applications"
          accent="teal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-white rounded-card border border-slate-light/50 shadow-card p-5">
          <h2 className="font-display font-semibold text-ink mb-4">Applications over time</h2>
          {data.applicationsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.applicationsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFEBE0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#7C879B' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#7C879B' }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #C9CFDB' }}
                />
                <Line type="monotone" dataKey="count" stroke="#F2A93B" strokeWidth={2.5} dot={{ r: 3, fill: '#F2A93B' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate text-center py-10">Not enough data yet.</p>
          )}
        </div>

        <div className="bg-white rounded-card border border-slate-light/50 shadow-card p-5">
          <h2 className="font-display font-semibold text-ink mb-4">By status</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={statusChartData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={2}
              >
                {statusChartData.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #C9CFDB' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {statusChartData.map((entry) => (
              <div key={entry.status} className="flex items-center gap-1.5 text-xs text-slate-dark">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }} />
                {entry.status} ({entry.count})
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-card border border-slate-light/50 shadow-card p-5">
          <h2 className="font-display font-semibold text-ink mb-4">Interview rounds by type</h2>
          {roundsChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={roundsChartData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFEBE0" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#7C879B' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="type" type="category" width={90} tick={{ fontSize: 11, fill: '#10172A' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #C9CFDB' }} />
                <Bar dataKey="count" fill="#2DD4BF" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate text-center py-10">No interview rounds logged yet.</p>
          )}
          {data.avgDaysToResponse !== null && (
            <p className="text-xs text-slate-dark mt-2 pt-3 border-t border-slate-light/50">
              On average, you hear back for a first interview{' '}
              <span className="font-semibold text-ink">{data.avgDaysToResponse} days</span> after applying.
            </p>
          )}
        </div>

        <div className="bg-white rounded-card border border-slate-light/50 shadow-card p-5">
          <h2 className="font-display font-semibold text-ink mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-amber-dark" />
            Upcoming interviews
          </h2>
          {data.upcoming.length > 0 ? (
            <div className="space-y-3">
              {data.upcoming.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-light/40 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{item.company}</p>
                    <p className="text-xs text-slate-dark truncate">{item.roundType} · {item.role}</p>
                  </div>
                  <span className="text-xs font-mono-tracker text-amber-dark whitespace-nowrap">
                    {formatDate(item.date)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate text-center py-10">Nothing scheduled right now.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
