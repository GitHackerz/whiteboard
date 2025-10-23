'use client';

import dynamic from 'next/dynamic';

// Dynamically import the OfflineIndicator to avoid SSR issues
const OfflineIndicatorClient = dynamic(() => import('./offline-indicator-client'), {
  ssr: false,
  loading: () => null,
});

export function OfflineIndicator() {
  return <OfflineIndicatorClient />;
}