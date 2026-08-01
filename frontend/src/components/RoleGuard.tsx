import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, RedirectToSignIn } from '@clerk/react';
import { useStore } from '../lib/store';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: 'candidate' | 'interviewer';
}

export default function RoleGuard({ children, allowedRole }: RoleGuardProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { userRole } = useStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // If not loaded or not signed in, we handle below
    if (!isLoaded || !isSignedIn) return;

    // If global state is still initializing, wait
    if (userRole === null) return;

    if (userRole === allowedRole) {
      setIsChecking(false);
    } else {
      // If role mismatch, bounce to dashboard
      navigate('/dashboard');
    }
  }, [isLoaded, isSignedIn, userRole, allowedRole, navigate]);

  if (isLoaded && !isSignedIn) {
    return <RedirectToSignIn forceRedirectUrl="/dashboard" />;
  }

  // Still checking (auth loading or global role fetching)
  if (isChecking || userRole === null) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
