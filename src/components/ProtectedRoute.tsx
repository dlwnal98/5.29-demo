import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const accessToken = sessionStorage.getItem('access_token');

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
