// frontend/src/components/LiveChart.jsx

import { useEffect, useRef, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Maximum number of data points to show on the chart
// 60 = one minute of history
const MAX_POINTS = 60;

function LiveChart({ batteryData }) {

  // history is an array of the last 60 data points
  // We use useRef so updating it doesn't cause extra re-renders
  const historyRef = useRef([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Every time new battery data arrives, add it to history
    if (!batteryData) return;

    const newPoint = {
      // Format time as HH:MM:SS for the X axis label
      time:        new Date(batteryData.timestamp).toLocaleTimeString(),
      voltage:     batteryData.voltage,
      temperature: batteryData.temperature,
      soc:         parseFloat(batteryData.soc?.toFixed(1)),
      current:     batteryData.current
    };

    // Add new point to the end
    historyRef.current = [...historyRef.current, newPoint];

    // Keep only the last MAX_POINTS entries
    // slice(-60) means "take the last 60 items"
    if (historyRef.current.length > MAX_POINTS) {
      historyRef.current = historyRef.current.slice(-MAX_POINTS);
    }

    // Update state to trigger re-render
    setChartData([...historyRef.current]);

  }, [batteryData]); // Run every time batteryData changes (every second)

  // Custom tooltip shown when hovering over the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#0B1020] border border-white/10 rounded-lg p-3 text-xs">
        <p className="text-gray-400 mb-2">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-5 h-full">

      <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
        📈 Live Telemetry — Last 60s
      </h3>

      {/* Voltage Chart */}
      <div className="mb-6">
        <p className="text-[#00E5FF] text-xs mb-2">Voltage (V)</p>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#6b7280', fontSize: 9 }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[290, 430]}
              tick={{ fill: '#6b7280', fontSize: 9 }}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="voltage"
              stroke="#00E5FF"
              strokeWidth={2}
              dot={false}              // No dots on every point - cleaner look
              isAnimationActive={false} // Disable animation for real-time data
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* SOC Chart */}
      <div className="mb-6">
        <p className="text-[#00FF88] text-xs mb-2">State of Charge (%)</p>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#6b7280', fontSize: 9 }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#6b7280', fontSize: 9 }}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="soc"
              stroke="#00FF88"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Temperature Chart */}
      <div>
        <p className="text-[#FF6B35] text-xs mb-2">Temperature (°C)</p>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#6b7280', fontSize: 9 }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[15, 70]}
              tick={{ fill: '#6b7280', fontSize: 9 }}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#FF6B35"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default LiveChart;