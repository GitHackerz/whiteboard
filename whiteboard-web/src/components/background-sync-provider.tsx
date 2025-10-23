'use client';

import { useBackgroundSync } from '@/hooks/use-background-sync';

export function BackgroundSyncProvider() {
  useBackgroundSync();
  return null;
}