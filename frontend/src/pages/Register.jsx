// frontend/src/pages/Register.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function Register() {
  // Form field values
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  // UI states
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const { login }    = useAuth();
  const navigate     = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        username, email, password
      });

      // Auto login after successful registration
      login(response.data.user, response.data.token);
      navigate('/dashboard');

    } catch (err) {
      // Show error message from backend
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center p-4">

      {/* Animated background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96
                        bg-[#00E5FF]/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">⚡</div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400 mt-1 text-sm">Join the EV Battery Monitor</p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400
                         rounded-lg p-3 mb-6 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <div className="space-y-4">

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="w-full bg-white/5 border border-white/10 rounded-lg
                           px-4 py-3 text-white placeholder-gray-600
                           focus:outline-none focus:border-[#00E5FF]/50
                           transition-colors"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg
                           px-4 py-3 text-white placeholder-gray-600
                           focus:outline-none focus:border-[#00E5FF]/50
                           transition-colors"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-white/5 border border-white/10 rounded-lg
                           px-4 py-3 text-white placeholder-gray-600
                           focus:outline-none focus:border-[#00E5FF]/50
                           transition-colors"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#00E5FF] hover:bg-[#00E5FF]/80 disabled:opacity-50
                         text-[#0B1020] font-bold py-3 rounded-lg
                         transition-all duration-200 mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

          </div>

          {/* Footer link */}
          <p className="text-gray-400 text-sm text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00E5FF] hover:underline">
              Sign in
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
}

export default Register;