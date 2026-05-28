// frontend/src/components/Sidebar.jsx

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Navigation items - icon, label, and route path
const NAV_ITEMS = [
  { icon: '⚡', label: 'Dashboard',  path: '/dashboard'  },
  { icon: '📊', label: 'Analytics',  path: '/analytics'  },
  { icon: '⚙️', label: 'Settings',   path: '/settings'   },
];

function Sidebar() {
  // collapsed state - sidebar shrinks to icon-only on small screens
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation(); // tells us which page we're on
  const { user, logout }  = useAuth();
  const navigate          = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.aside
      // Animate width change when collapsing/expanding
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-[#0D1425] border-r border-white/8 flex flex-col
                 sticky top-0 shrink-0 overflow-hidden z-40"
    >

      {/* ── Logo Row ──────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-5
                      border-b border-white/8">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{    opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="text-2xl">⚡</span>
              <span className="font-bold text-white text-sm leading-tight">
                EV Battery<br/>
                <span className="text-[#00E5FF] font-normal">Monitor</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-lg border border-white/10 flex items-center
                     justify-center text-gray-400 hover:bg-white/5
                     hover:text-white transition-all shrink-0"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* ── Navigation Links ──────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl
                          transition-all duration-200 group relative
                          ${isActive
                            ? 'bg-[#00E5FF]/10 text-[#00E5FF]'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                          }`}
            >
              {/* Active indicator bar on left edge */}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2
                             w-1 h-6 bg-[#00E5FF] rounded-r-full"
                />
              )}

              <span className="text-lg shrink-0">{item.icon}</span>

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1,  x: 0   }}
                    exit={{    opacity: 0,  x: -10  }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-[#1a2540]
                                border border-white/10 rounded-lg text-white text-xs
                                whitespace-nowrap opacity-0 group-hover:opacity-100
                                pointer-events-none transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── User Profile Section ──────────────── */}
      <div className="border-t border-white/8 p-3">

        {/* User info row */}
        <div className={`flex items-center gap-3 px-2 py-2 mb-2
                        ${collapsed ? 'justify-center' : ''}`}>
          {/* Avatar circle with first letter of username */}
          <div className="w-8 h-8 rounded-full bg-[#00E5FF]/20 border border-[#00E5FF]/30
                          flex items-center justify-center shrink-0">
            <span className="text-[#00E5FF] text-xs font-bold uppercase">
              {user?.username?.[0] || '?'}
            </span>
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{    opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="text-white text-xs font-medium truncate">
                  {user?.username}
                </p>
                <p className="text-gray-500 text-xs truncate">
                  {user?.email}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                      text-gray-400 hover:bg-red-500/10 hover:text-red-400
                      transition-all duration-200 group
                      ${collapsed ? 'justify-center' : ''}`}
        >
          <span className="text-lg shrink-0">🚪</span>

          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{    opacity: 0 }}
                className="text-sm font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>

          {/* Tooltip when collapsed */}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2 py-1 bg-[#1a2540]
                            border border-white/10 rounded-lg text-white text-xs
                            whitespace-nowrap opacity-0 group-hover:opacity-100
                            pointer-events-none transition-opacity z-50">
              Logout
            </div>
          )}
        </button>
      </div>

    </motion.aside>
  );
}

export default Sidebar;