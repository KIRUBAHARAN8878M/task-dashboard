import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../utils/reduxHooks';

export default function PrivateRoute() {
  const isAuth = useAppSelector(s => s.auth.isAuthenticated);
  const loc = useLocation();
  return isAuth ? <Outlet /> : <Navigate to="/auth/login" replace state={{ from: loc }} />;
}
