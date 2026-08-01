import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ClerkProvider } from '@clerk/react';
import './index.css';

import GlobalOnboarding from './components/GlobalOnboarding';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <GlobalOnboarding>
        <RouterProvider router={router} />
      </GlobalOnboarding>
    </ClerkProvider>
  </StrictMode>,
);
