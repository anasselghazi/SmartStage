import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const { user, loading, isAdmin, isApprouve } = useAuth();

  console.log("PATH:", location.pathname);
  console.log("USER:", user);
  console.log("LOADING:", loading);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    console.log("Redirect because user is null");
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    console.log("Redirect because not admin");
    return <Navigate to="/dashboard" replace />;
  }

  if (!isAdmin() && !isApprouve()) {
    console.log("Redirect because not approved");
    return <Navigate to="/attente" replace />;
  }

  return children;
};

export default PrivateRoute;
