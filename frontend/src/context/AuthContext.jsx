// frontend/src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';

// createContext makes a "global variable" that any component can read
const AuthContext = createContext(null);

// AuthProvider wraps your whole app (see App.jsx)
// Any component inside it can call useAuth() to get user info
export function AuthProvider({ children }) {

  // user holds the logged-in user's info (or null if not logged in)
  const [user, setUser]   = useState(null);
  // token holds the JWT string
  const [token, setToken] = useState(null);
  // loading prevents the app from flashing "not logged in" on refresh
  const [loading, setLoading] = useState(true);

  // On first load, check if user was previously logged in
  // by reading from localStorage (persists across browser refreshes)
  useEffect(() => {
    const savedToken = localStorage.getItem('ev_token');
    const savedUser  = localStorage.getItem('ev_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    // Done checking - allow app to render
    setLoading(false);
  }, []);

  // Called after successful login or register
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    // Save to localStorage so login persists on page refresh
    localStorage.setItem('ev_token', jwtToken);
    localStorage.setItem('ev_user', JSON.stringify(userData));
  };

  // Called when user clicks logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ev_token');
    localStorage.removeItem('ev_user');
  };

  // Don't render children until we've checked localStorage
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="text-[#00E5FF] text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook - instead of writing useContext(AuthContext) everywhere,
// components just call useAuth()
export function useAuth() {
  return useContext(AuthContext);
}