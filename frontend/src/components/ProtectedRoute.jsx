// frontend/src/components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This component wraps pages that require login
// If user is not logged in → redirect to /login
// If user IS logged in → show the page normally
function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // Replace: true means the login page replaces dashboard in history
    // so pressing Back doesn't loop them back to dashboard
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;