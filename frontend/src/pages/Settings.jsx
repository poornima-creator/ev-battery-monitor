// frontend/src/pages/Settings.jsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

// A single settings section card
function SettingsCard({ title, icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1,  y: 0  }}
      className="bg-white/4 border border-white/8 rounded-2xl p-6 mb-4"
    >
      <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
        <span>{icon}</span>
        <span>{title}</span>
      </h3>
      {children}
    </motion.div>
  );
}

// A single settings row with label + control
function SettingsRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-3
                    border-b border-white/5 last:border-0">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {description && (
          <p className="text-gray-500 text-xs mt-0.5">{description}</p>
        )}
      </div>
      <div className="ml-4 shrink-0">
        {children}
      </div>
    </div>
  );
}

// A toggle switch component
function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300
                  ${value ? 'bg-[#00E5FF]' : 'bg-white/10'}`}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
      />
    </button>
  );
}

function Settings() {
  const { user } = useAuth();

  // ── Profile form state ─────────────────────
  const [username,    setUsername]    = useState(user?.username || '');
  const [email,       setEmail]       = useState(user?.email    || '');
  const [saveMsg,     setSaveMsg]     = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  // ── Password form state ────────────────────
  const [currentPass, setCurrentPass] = useState('');
  const [newPass,     setNewPass]     = useState('');
  const [passMsg,     setPassMsg]     = useState('');

  // ── Notification preferences ───────────────
  const [notifs, setNotifs] = useState({
    overheat:   true,
    lowSOC:     true,
    highCurrent: false,
    lowSOH:     true,
  });

  // ── Simulation preferences ─────────────────
  const [simPrefs, setSimPrefs] = useState({
    autoSave:      true,
    darkMode:      true,
    soundAlerts:   false,
  });

  // ── Thresholds ─────────────────────────────
  const [thresholds, setThresholds] = useState({
    tempWarning:  45,
    tempDanger:   55,
    socWarning:   25,
    socDanger:    15,
  });

  // ── Handlers ───────────────────────────────
  const handleSaveProfile = async () => {
    setSaveLoading(true);
    setSaveMsg('');
    // Simulate API call (you can wire this to a real endpoint later)
    await new Promise(r => setTimeout(r, 800));
    setSaveMsg('✅ Profile updated successfully');
    setSaveLoading(false);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const handleChangePassword = async () => {
    if (!currentPass || !newPass) {
      setPassMsg('❌ Please fill in both fields');
      return;
    }
    if (newPass.length < 6) {
      setPassMsg('❌ New password must be at least 6 characters');
      return;
    }
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));
    setPassMsg('✅ Password changed successfully');
    setCurrentPass('');
    setNewPass('');
    setTimeout(() => setPassMsg(''), 3000);
  };

  const inputClass = `w-full bg-white/5 border border-white/10 rounded-lg
                      px-4 py-2.5 text-white text-sm placeholder-gray-600
                      focus:outline-none focus:border-[#00E5FF]/50 transition-colors`;

  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      <div className="p-6 max-w-3xl mx-auto">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your account and preferences
          </p>
        </div>

        {/* ── Profile Settings ────────────────── */}
        <SettingsCard title="Profile" icon="👤">
          <div className="space-y-4">

            <div>
              <label className="text-gray-400 text-xs mb-1.5 block uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1.5 block uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            {saveMsg && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-green-400"
              >
                {saveMsg}
              </motion.p>
            )}

            <button
              onClick={handleSaveProfile}
              disabled={saveLoading}
              className="bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]
                         px-5 py-2 rounded-lg text-sm hover:bg-[#00E5FF]/20
                         transition-all disabled:opacity-50"
            >
              {saveLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </SettingsCard>

        {/* ── Change Password ──────────────────── */}
        <SettingsCard title="Change Password" icon="🔐">
          <div className="space-y-4">

            <div>
              <label className="text-gray-400 text-xs mb-1.5 block uppercase tracking-wider">
                Current Password
              </label>
              <input
                type="password"
                value={currentPass}
                onChange={e => setCurrentPass(e.target.value)}
                placeholder="Enter current password"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1.5 block uppercase tracking-wider">
                New Password
              </label>
              <input
                type="password"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                placeholder="Min 6 characters"
                className={inputClass}
              />
            </div>

            {passMsg && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-sm ${passMsg.includes('✅')
                  ? 'text-green-400' : 'text-red-400'}`}
              >
                {passMsg}
              </motion.p>
            )}

            <button
              onClick={handleChangePassword}
              className="bg-white/5 border border-white/10 text-gray-300
                         px-5 py-2 rounded-lg text-sm hover:bg-white/10
                         transition-all"
            >
              Update Password
            </button>
          </div>
        </SettingsCard>

        {/* ── Alert Thresholds ─────────────────── */}
        <SettingsCard title="Alert Thresholds" icon="🚨">
          <p className="text-gray-500 text-xs mb-4">
            Customize when warnings and danger alerts are triggered
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'tempWarning',  label: 'Temp Warning (°C)',  color: '#F59E0B' },
              { key: 'tempDanger',   label: 'Temp Danger (°C)',   color: '#EF4444' },
              { key: 'socWarning',   label: 'SOC Warning (%)',    color: '#F59E0B' },
              { key: 'socDanger',    label: 'SOC Danger (%)',     color: '#EF4444' },
            ].map(({ key, label, color }) => (
              <div key={key}>
                <label className="text-gray-400 text-xs mb-1.5 block">
                  {label}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={thresholds[key]}
                    onChange={e => setThresholds(prev => ({
                      ...prev,
                      [key]: Number(e.target.value)
                    }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg
                               px-3 py-2 text-sm focus:outline-none
                               focus:border-[#00E5FF]/50 transition-colors"
                    style={{ color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => alert('Thresholds saved! (Wire to backend in production)')}
            className="mt-4 bg-white/5 border border-white/10 text-gray-300
                       px-5 py-2 rounded-lg text-sm hover:bg-white/10 transition-all"
          >
            Save Thresholds
          </button>
        </SettingsCard>

        {/* ── Notification Preferences ──────────── */}
        <SettingsCard title="Notifications" icon="🔔">
          <SettingsRow
            label="Overheat Alert"
            description="Warn when temperature exceeds threshold"
          >
            <Toggle
              value={notifs.overheat}
              onChange={v => setNotifs(p => ({ ...p, overheat: v }))}
            />
          </SettingsRow>

          <SettingsRow
            label="Low Battery Alert"
            description="Warn when SOC drops below threshold"
          >
            <Toggle
              value={notifs.lowSOC}
              onChange={v => setNotifs(p => ({ ...p, lowSOC: v }))}
            />
          </SettingsRow>

          <SettingsRow
            label="High Current Alert"
            description="Warn on sudden current spikes"
          >
            <Toggle
              value={notifs.highCurrent}
              onChange={v => setNotifs(p => ({ ...p, highCurrent: v }))}
            />
          </SettingsRow>

          <SettingsRow
            label="Battery Health Alert"
            description="Warn when SOH drops below 80%"
          >
            <Toggle
              value={notifs.lowSOH}
              onChange={v => setNotifs(p => ({ ...p, lowSOH: v }))}
            />
          </SettingsRow>
        </SettingsCard>

        {/* ── App Preferences ───────────────────── */}
        <SettingsCard title="App Preferences" icon="🎛️">
          <SettingsRow
            label="Auto-save Data"
            description="Save battery readings to MongoDB automatically"
          >
            <Toggle
              value={simPrefs.autoSave}
              onChange={v => setSimPrefs(p => ({ ...p, autoSave: v }))}
            />
          </SettingsRow>

          <SettingsRow
            label="Sound Alerts"
            description="Play a sound when danger alerts trigger"
          >
            <Toggle
              value={simPrefs.soundAlerts}
              onChange={v => setSimPrefs(p => ({ ...p, soundAlerts: v }))}
            />
          </SettingsRow>
        </SettingsCard>

        {/* ── Danger Zone ───────────────────────── */}
        <SettingsCard title="Danger Zone" icon="⛔">
          <SettingsRow
            label="Clear All Session Data"
            description="Permanently delete all battery history from MongoDB"
          >
            <button
              onClick={() => {
                if (window.confirm(
                  'Are you sure? This will permanently delete all your battery history.'
                )) {
                  alert('Data cleared! (Wire to DELETE /api/data/all endpoint)');
                }
              }}
              className="bg-red-500/10 border border-red-500/30 text-red-400
                         px-4 py-2 rounded-lg text-xs hover:bg-red-500/20
                         transition-all"
            >
              Clear Data
            </button>
          </SettingsRow>

          <SettingsRow
            label="App Version"
            description="Current build"
          >
            <span className="text-gray-500 text-xs bg-white/5 px-3 py-1 rounded-full">
              v1.0.0
            </span>
          </SettingsRow>
        </SettingsCard>

      </div>
    </div>
  );
}

export default Settings;