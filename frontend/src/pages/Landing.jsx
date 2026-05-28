// frontend/src/pages/Landing.jsx

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Landing() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-white flex flex-col
                    items-center justify-center p-6 text-center">

      {/* Glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
                        bg-[#00E5FF]/5 rounded-full blur-3xl" />
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-7xl mb-6">⚡</div>

        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00E5FF]
                       to-[#00FF88] bg-clip-text text-transparent">
          EV Battery Monitor
        </h1>

        <p className="text-gray-400 text-lg max-w-md mx-auto mb-10">
          Real-time battery health monitoring and simulation platform.
          Track voltage, current, temperature, SOC and SOH live.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {['⚡ Live Metrics', '📊 Analytics', '🔋 SOC & SOH', '🌡️ Temperature', '🚨 Alerts'].map(f => (
            <span key={f}
              className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm">
              {f}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center">
          <Link to="/register"
            className="bg-[#00E5FF] hover:bg-[#00E5FF]/80 text-[#0B1020]
                       font-bold px-8 py-3 rounded-lg transition-all">
            Get Started
          </Link>
          <Link to="/login"
            className="border border-white/20 hover:bg-white/5 text-white
                       font-bold px-8 py-3 rounded-lg transition-all">
            Sign In
          </Link>
        </div>
      </motion.div>

    </div>
  );
}

export default Landing;