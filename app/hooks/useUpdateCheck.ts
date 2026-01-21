import { useEffect } from 'react';
import * as Updates from 'expo-updates';

interface UpdateCheckConfig {
  onUpdateAvailable?: () => void;
  onUpdateFetched?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to check for and fetch OTA updates
 * Runs on app launch and can optionally trigger callbacks when updates are found
 */
export const useUpdateCheck = (config?: UpdateCheckConfig) => {
  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      if (!__DEV__) {
        console.log('Checking for updates...');
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          console.log('✅ New update available, fetching...');
          config?.onUpdateAvailable?.();

          await Updates.fetchUpdateAsync();
          console.log('✅ Update fetched successfully');
          config?.onUpdateFetched?.();

          // Optional: Uncomment to reload app immediately after update
          // await Updates.reloadAsync();
        } else {
          console.log('✅ App is up to date');
        }
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('❌ Error checking for updates:', err.message);
      config?.onError?.(err);
    }
  };

  return { checkForUpdates };
};
