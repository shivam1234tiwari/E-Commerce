// client/src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

export default function ProtectedRoute() {
  const { user } = useContext(ShopContext);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}