import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/store';

const ProtectedRoute = () => {
  const { accessToken } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
