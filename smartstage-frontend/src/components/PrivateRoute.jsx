import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin, isApprouve } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Non connecté
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Route admin uniquement
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Compte RH non approuvé
  if (!isAdmin() && !isApprouve()) {
    return <Navigate to="/attente" replace />;
  }

  return children;
};

export default PrivateRoute;