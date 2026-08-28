import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, Briefcase, DollarSign, TrendingUp, Mail, Trophy } from 'lucide-react';
import { dashboardApi } from '../../api/endpoints';

const STAGE_COLORS: Record<string, string> = {
  LEAD: '#64748b',
  CONTACTED: '#2563eb',
  QUALIFIED: '#7c3aed',
  PROPOSAL: '#d97706',
  WON: '#059669',
  LOST: '#dc2626',
};

const STAGE_LABELS: Record<string, string> = {
  LEAD: 'Lead', CONTACTED: 'Contacted', QUALIFIED: 'Qualified',
  PROPOSAL: 'Proposal', WON: 'Won', LOST: 'Lost',
};

const EMAIL_COLORS: Record<string, string> = {
  SENT: '#2563eb', OPENED: '#d97706', REPLIED: '#059669', BOUNCED: '#dc2626',
};

function formatCurrency(val: number) {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}k`;
  return `$${val}`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#ffffff', border: '1px solid #e2e8f0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      borderRadius: 8, padding: '10px 14px', fontSize: 13,
    }}>
      <p style={{ color: '#475569', marginBottom: 4, fontWeight: 500 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {p.name === 'Value' ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

export function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.stats().then(r => r.data),
    refetchInterval: 30000,
  });

  if (isLoading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );

  const barData = (stats?.dealsByStage ?? []).map(s => ({
    stage: STAGE_LABELS[s.stage] ?? s.stage,
    Deals: s.count,
    Value: Number(s.value),
    fill: STAGE_COLORS[s.stage] ?? '#64748b',
  }));

  const pieData = (stats?.emailsByStatus ?? []).map(e => ({
    name: e.status,
    value: e.count,
    color: EMAIL_COLORS[e.status] ?? '#64748b',
  }));

  return (
    <div className="page">
      <div className="page-header" style={{ paddingBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Your sales pipeline at a glance</p>
          </div>
          <div style={{
            fontSize: 12, color: '#64748b',
            background: '#ffffff', border: '1px solid #e2e8f0',
            padding: '5px 12px', borderRadius: 20,
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
          }}>
            🔄 Auto-refreshes every 30s
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <StatCard color="blue" icon={<Users size={20} />} label="Total Contacts"
            value={stats?.totalContacts ?? 0} />
          <StatCard color="purple" icon={<Briefcase size={20} />} label="Active Deals"
            value={stats?.totalDeals ?? 0} />
          <StatCard color="green" icon={<DollarSign size={20} />} label="Pipeline Value"
            value={formatCurrency(Number(stats?.totalPipelineValue ?? 0))} />
          <StatCard color="yellow" icon={<TrendingUp size={20} />} label="Conversion Rate"
            value={`${stats?.conversionRate ?? 0}%`} />
          <StatCard color="green" icon={<Trophy size={20} />} label="Won Deals"
            value={stats?.wonDeals ?? 0} />
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
          {/* Bar chart */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 20 }}>Deals by Stage</h3>
            {barData.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <Briefcase size={40} />
                <p>No deals yet — add some from the Pipeline page</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} barSize={32}>
                  <XAxis dataKey="stage" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                  <Bar dataKey="Deals" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie chart */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>
              <Mail size={15} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: '#2563eb' }} />
              Email Engagement
            </h3>
            {pieData.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <Mail size={40} />
                <p>No emails logged yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={95}
                    paddingAngle={3} dataKey="value" stroke="none">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Legend
                    formatter={(value) => <span style={{ color: '#475569', fontSize: 12, fontWeight: 500 }}>{value}</span>}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#ffffff', border: '1px solid #e2e8f0',
                      borderRadius: 8, fontSize: 13, boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pipeline funnel summary */}
        {barData.length > 0 && (
          <div className="card" style={{ padding: 24, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>Pipeline Funnel</h3>
            <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
              {barData.map((s, i) => {
                const maxCount = Math.max(...barData.map(b => b.Deals), 1);
                const pct = Math.max((s.Deals / maxCount) * 100, 10);
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: '#f8fafc', padding: '12px 8px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                      {s.stage}
                    </div>
                    <div style={{
                      width: `${pct}%`, height: 28, borderRadius: 6,
                      background: s.fill,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      minWidth: 28,
                    }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{s.Deals}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#0f172a', fontWeight: 600 }}>
                      {formatCurrency(s.Value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ color, icon, label, value }: {
  color: string; icon: React.ReactNode; label: string; value: string | number;
}) {
  return (
    <div className={`stat-card ${color}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: color === 'blue' ? '#eff6ff'
            : color === 'green' ? '#ecfdf5'
            : color === 'yellow' ? '#fffbeb'
            : '#f5f3ff',
          color: color === 'blue' ? '#2563eb'
            : color === 'green' ? '#059669'
            : color === 'yellow' ? '#d97706'
            : '#7c3aed',
        }}>
          {icon}
        </div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
