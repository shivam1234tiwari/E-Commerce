// client/src/components/AdminRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

export default function AdminRoute() {
  const { user } = useContext(ShopContext);

  // Check if logged-in user has verified admin privileges
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}