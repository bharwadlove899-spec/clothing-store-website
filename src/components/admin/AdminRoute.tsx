import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';

export default function AdminRoute() {
  const { user, isAdmin, loading } = useAdmin();

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-black text-white">Loading...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
