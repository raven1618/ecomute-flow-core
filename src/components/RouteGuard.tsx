
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RouteGuardProps {
  children: ReactNode;
}

const RouteGuard = ({ children }: RouteGuardProps) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to='/login' replace />;
  }
  
  return <>{children}</>;
};

export default RouteGuard;
