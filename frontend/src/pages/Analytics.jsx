// frontend/src/pages/Analytics.jsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import { useAnalytics } from '../hooks/useAnalytics';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';

// Day names for weekly chart X axis
const DAY_NAMES = ['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


function Analytics() {
  const { summary, daily, weekly,
          loading, error, exportCSV, refetch } = useAnalytics();

  // Toggle between daily and weekly view
  const [view, setView] = useState('daily');

  // The data shown in charts changes based on selected view
  const chartData = view === 'daily'
    ? daily.map(d => ({
        label:       `${d.hour}:00`,  // e.g. "14:00"
        voltage:     d.avgVoltage,
        temperature: d.avgTemperature,
        soc:         d.avgSOC,
        soh:         d.avgSOH,
        current:     d.avgCurrent,
        records:     d.count
      }))
    : weekly.map(d => ({
        label:       DAY_NAMES[d.day] || `Day ${d.day}`,
        voltage:     d.avgVoltage,
        temperature: d.avgTemperature,
        soc:         d.avgSOC,
        soh:         d.avgSOH,
        current:     d.avgCurrent,
        records:     d.count
      }));

  // Shared tooltip style for all charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#0B1020] border border-white/10 rounded-lg p-3 text-xs">
        <p className="text-gray-400 mb-2 font-medium">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }} className="mb-0.5">
            {p.name}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    );
  };

  // ── Loading state ──────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="text-4xl mb-4"
          >
            ⚡
          </motion.div>
          <p className="text-[#00E5FF] animate-pulse">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-[#0B1020] text-white">
    <div className="p-6 max-w-7xl mx-auto">

      {/* ── Page Header ─────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">
            Historical battery performance data
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refetch}
            className="flex items-center gap-2 border border-white/10 px-4 py-2
                       rounded-lg text-gray-400 text-sm hover:bg-white/5 transition-all"
          >
            🔄 Refresh
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-[#00E5FF]/10 border border-[#00E5FF]/30
                       px-4 py-2 rounded-lg text-[#00E5FF] text-sm
                       hover:bg-[#00E5FF]/20 transition-all"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* rest of the analytics JSX stays exactly the same ... */}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={refetch}
              className="flex items-center gap-2 border border-white/10 px-4 py-2
                         rounded-lg text-gray-400 text-sm hover:bg-white/5 transition-all"
            >
              🔄 Refresh
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-[#00E5FF]/10 border border-[#00E5FF]/30
                         px-4 py-2 rounded-lg text-[#00E5FF] text-sm
                         hover:bg-[#00E5FF]/20 transition-all"
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        {/* ── Error state ─────────────────────── */}
        {error && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400
                          rounded-xl p-4 mb-6 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* ── Summary Cards ───────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Avg State of Charge"
            value={summary?.avgSOC}
            unit="%"
            icon="🔋"
            color="#00FF88"
            subtitle="Average across all sessions"
          />
          <StatCard
            label="Avg Battery Health"
            value={summary?.avgSOH}
            unit="%"
            icon="🩺"
            color="#00E5FF"
            subtitle={`Lowest recorded: ${summary?.minSOH ?? '—'}%`}
          />
          <StatCard
            label="Peak Temperature"
            value={summary?.maxTemp}
            unit="°C"
            icon="🌡️"
            color="#FF6B35"
            subtitle={`Average: ${summary?.avgTemp ?? '—'}°C`}
          />
          <StatCard
            label="Total Records"
            value={summary?.totalRecords?.toLocaleString()}
            unit=""
            icon="📊"
            color="#A78BFA"
            subtitle="Data points collected"
          />
        </div>

        {/* ── View Toggle ─────────────────────── */}
        <div className="flex gap-2 mb-6">
          {['daily', 'weekly'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize
                          transition-all duration-200
                          ${view === v
                            ? 'bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF]'
                            : 'border border-white/10 text-gray-400 hover:bg-white/5'
                          }`}
            >
              {v === 'daily' ? '📅 Last 24 Hours' : '📆 Last 7 Days'}
            </button>
          ))}
        </div>

        {/* ── No data message ─────────────────── */}
        {chartData.length === 0 && !loading && (
          <div className="bg-white/4 border border-white/8 rounded-2xl p-12
                          text-center mb-6">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-400">No historical data yet.</p>
            <p className="text-gray-500 text-sm mt-1">
              Use the dashboard in Driving or Charging mode for a few minutes,
              then come back here.
            </p>
            <Link to="/dashboard"
              className="inline-block mt-4 bg-[#00E5FF]/10 border border-[#00E5FF]/30
                         text-[#00E5FF] px-5 py-2 rounded-lg text-sm hover:bg-[#00E5FF]/20
                         transition-all">
              Go to Dashboard →
            </Link>
          </div>
        )}

        {/* ── SOC Over Time Chart ─────────────── */}
        {chartData.length > 0 && (
          <>
            <div className="bg-white/4 border border-white/8 rounded-2xl p-5 mb-4">
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                🔋 SOC & SOH — {view === 'daily' ? 'Hourly Avg' : 'Daily Avg'}
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    width={35}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ color: '#9CA3AF', fontSize: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="soc"
                    name="SOC %"
                    stroke="#00FF88"
                    strokeWidth={2}
                    dot={{ fill: '#00FF88', r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="soh"
                    name="SOH %"
                    stroke="#00E5FF"
                    strokeWidth={2}
                    dot={{ fill: '#00E5FF', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* ── Temperature Chart ─────────────── */}
            <div className="bg-white/4 border border-white/8 rounded-2xl p-5 mb-4">
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                🌡️ Temperature — {view === 'daily' ? 'Hourly Avg' : 'Daily Avg'}
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 70]}
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    width={35}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="temperature"
                    name="Temp °C"
                    fill="#FF6B35"
                    radius={[4, 4, 0, 0]}   // Rounded top corners
                    fillOpacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ── Voltage Chart ─────────────────── */}
            <div className="bg-white/4 border border-white/8 rounded-2xl p-5 mb-4">
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                ⚡ Voltage — {view === 'daily' ? 'Hourly Avg' : 'Daily Avg'}
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                  />
                  <YAxis
                    domain={[280, 440]}
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    width={40}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="voltage"
                    name="Voltage V"
                    stroke="#A78BFA"
                    strokeWidth={2}
                    dot={{ fill: '#A78BFA', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* ── Records Per Period ────────────── */}
            <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                📊 Data Points Collected
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    width={35}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="records"
                    name="Records"
                    fill="#00E5FF"
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.6}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        <p className="text-center text-gray-600 text-xs mt-8">
          Data stored in MongoDB • Updates every 10 seconds during active sessions
        </p>

      </div>
    
  );
}

export default Analytics;