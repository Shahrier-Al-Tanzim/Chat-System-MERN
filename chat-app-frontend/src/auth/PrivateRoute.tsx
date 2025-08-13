import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const PrivateRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default PrivateRoute;
