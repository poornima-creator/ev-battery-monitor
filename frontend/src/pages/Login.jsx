// frontend/src/pages/Login.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center p-4">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96
                        bg-[#00FF88]/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">

          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🔋</div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400 mt-1 text-sm">Sign in to your dashboard</p>
          </div>

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

          <div className="space-y-4">

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg
                           px-4 py-3 text-white placeholder-gray-600
                           focus:outline-none focus:border-[#00FF88]/50
                           transition-colors"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full bg-white/5 border border-white/10 rounded-lg
                           px-4 py-3 text-white placeholder-gray-600
                           focus:outline-none focus:border-[#00FF88]/50
                           transition-colors"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#00FF88] hover:bg-[#00FF88]/80 disabled:opacity-50
                         text-[#0B1020] font-bold py-3 rounded-lg
                         transition-all duration-200 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </div>

          <p className="text-gray-400 text-sm text-center mt-6">
            No account yet?{' '}
            <Link to="/register" className="text-[#00FF88] hover:underline">
              Create one
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
}

export default Login;