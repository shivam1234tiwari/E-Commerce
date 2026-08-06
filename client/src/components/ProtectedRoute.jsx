import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

export default function ProtectedRoute({ children }) {
  const { user } = useContext(ShopContext);
  return user ? children : <Navigate to="/auth" replace />;
}