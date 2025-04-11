// ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token'); // có thể đổi thành check cookie

  // Nếu chưa đăng nhập, chuyển hướng về /login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
