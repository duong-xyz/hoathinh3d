import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/store';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isAdmin = isAuthenticated && user?.role?.includes('ROLE_ADMIN');
  const location = useLocation();
  // if (!isAuthenticated) {
  //   return <Navigate to="/" replace />;
  // }
  if (!isAdmin) {
    return <Navigate to="/" state={{ openLogin: true, from: location.pathname }} replace />;
  }

  return <Outlet />;
};