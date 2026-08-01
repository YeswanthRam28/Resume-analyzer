import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/react';
import axios from 'axios';
import { useStore } from '../lib/store';
import OnboardingModal from './OnboardingModal';

export default function GlobalOnboarding({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn } = useAuth();
  const { userRole, setUserRole } = useStore();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      if (!isSignedIn) {
        setInitialCheckDone(true);
        return;
      }
      try {
        const token = await getToken();
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await axios.get(`${API_URL}/api/dashboard/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.role) {
          setUserRole(response.data.role);
        } else {
          setUserRole(null);
        }
      } catch (err) {
        console.error("Failed to fetch role", err);
      } finally {
        setInitialCheckDone(true);
      }
    };
    
    fetchRole();
  }, [isSignedIn, getToken, setUserRole]);

  const needsOnboarding = isSignedIn && initialCheckDone && userRole === null;

  return (
    <>
      {children}
      {needsOnboarding && (
        <OnboardingModal onComplete={() => console.log("Onboarding complete")} />
      )}
    </>
  );
}
