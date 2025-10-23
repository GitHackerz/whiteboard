'use client';

import { useEffect } from 'react';
import { useOffline } from '@/contexts/offline-context';
import { offlineApiClient } from '@/lib/offline-api';

export function useBackgroundSync() {
  const { isOnline, connectionRestored } = useOffline();

  useEffect(() => {
    if (isOnline && connectionRestored) {
      // Sync pending data when connection is restored
      void syncPendingData();
    }
  }, [isOnline, connectionRestored]);

  const syncPendingData = async () => {
    try {
      // Get pending offline actions from localStorage
      const pendingActions = JSON.parse(
        localStorage.getItem('pendingOfflineActions') || '[]'
      );

      if (pendingActions.length === 0) return;

      console.log(`Syncing ${pendingActions.length} pending actions...`);

      // Process each pending action
      const results = await Promise.allSettled(
        pendingActions.map(async (action: any) => {
          try {
            const response = await offlineApiClient.request(
              action.method,
              action.urlPath,
              action.data,
              { withToken: action.withToken }
            );

            if (response.success) {
              console.log(`Successfully synced action: ${action.id}`);
              return { id: action.id, success: true };
            } else {
              console.error(`Failed to sync action: ${action.id}`, response.error);
              return { id: action.id, success: false, error: response.error };
            }
          } catch (error) {
            console.error(`Error syncing action: ${action.id}`, error);
            return { id: action.id, success: false, error };
          }
        })
      );

      // Remove successfully synced actions
      const successfulIds = results
        .filter(result => result.status === 'fulfilled' && result.value.success)
        .map(result => (result as PromiseFulfilledResult<any>).value.id);

      const updatedPendingActions = pendingActions.filter(
        (action: any) => !successfulIds.includes(action.id)
      );

      localStorage.setItem('pendingOfflineActions', JSON.stringify(updatedPendingActions));

      if (successfulIds.length > 0) {
        console.log(`Successfully synced ${successfulIds.length} actions`);
      }

      // Handle failed actions (could implement retry logic here)
      const failedActions = results.filter(
        result => result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.success)
      );

      if (failedActions.length > 0) {
        console.warn(`${failedActions.length} actions failed to sync`);
      }

    } catch (error) {
      console.error('Error during background sync:', error);
    }
  };

  const addPendingAction = (action: {
    id: string;
    method: 'post' | 'patch' | 'put' | 'delete';
    urlPath: string;
    data?: any;
    withToken?: boolean;
  }) => {
    const pendingActions = JSON.parse(
      localStorage.getItem('pendingOfflineActions') || '[]'
    );

    // Check if action already exists
    const existingIndex = pendingActions.findIndex((a: any) => a.id === action.id);
    if (existingIndex >= 0) {
      // Update existing action
      pendingActions[existingIndex] = { ...action, timestamp: Date.now() };
    } else {
      // Add new action
      pendingActions.push({ ...action, timestamp: Date.now() });
    }

    localStorage.setItem('pendingOfflineActions', JSON.stringify(pendingActions));
  };

  return { addPendingAction };
}

// Utility function to generate unique action IDs
export function generateActionId(): string {
  return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}