import { useQuery } from '@tanstack/react-query';
import { AppState } from 'react-native';
import { useEffect } from 'react';
import InstalledApps from '../../modules/installed-apps';

export const useNativePermissions = () => {
  const query = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      return await InstalledApps.checkPermissions();
    },
    staleTime: 0, // Always fetch fresh data
  });

  // Auto-refetch when user returns to the app from Settings
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        query.refetch();
      }
    });

    return () => subscription.remove();
  }, [query]);

  return query;
};
