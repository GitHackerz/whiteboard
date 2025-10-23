'use client';

import { useOffline } from '@/contexts/offline-context';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OfflineIndicatorClient() {
  const { isOnline, connectionRestored } = useOffline();

  if (isOnline && !connectionRestored) {
    return null; // Don't show anything when online and no recent reconnection
  }

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 max-w-sm shadow-lg border rounded-lg p-3",
      isOnline
        ? "border-green-200 bg-green-50 text-green-800"
        : "border-orange-200 bg-orange-50 text-orange-800"
    )}>
      <div className="flex items-center gap-2">
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4" />
            <div className="flex items-center gap-2">
              <span>Back online</span>
              {connectionRestored && (
                <Badge variant="secondary" className="text-xs">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Syncing data...
                </Badge>
              )}
            </div>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span>
              You&apos;re offline. Some features may be limited.
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export function OfflineBanner() {
  const { isOnline } = useOffline();

  if (isOnline) return null;

  return (
    <div className="bg-orange-100 border-b border-orange-200 px-4 py-2">
      <div className="flex items-center justify-center gap-2 text-orange-800">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm font-medium">
          You&apos;re currently offline. Data may be from cache.
        </span>
      </div>
    </div>
  );
}

export function CacheIndicator({ fromCache }: { fromCache?: boolean }) {
  if (!fromCache) return null;

  return (
    <Badge variant="outline" className="text-xs text-muted-foreground">
      Cached
    </Badge>
  );
}