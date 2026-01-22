import React, { useEffect } from 'react';
import Routes from './app/routes';
import {
  useFonts as useRobotoFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import {
  useFonts as useRubikFonts,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_700Bold,
} from '@expo-google-fonts/rubik';
import { AlertProvider } from './app/shared/context/AlertContext';
import { ErrorBoundary } from './app/shared/context/ErrorBoundary';
import { initializeDatabase } from './app/infrastructure/database';
import { DatabaseProvider } from '@/shared/context/DatabaseContext';
import { useUpdateCheck } from './app/shared/hooks/useUpdateCheck';
import './app/infrastructure/i18n';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: __DEV__,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

function AppContent() {
  useEffect(() => {
    initializeDatabase().catch(error =>
      console.error('Failed to initialize database:', error),
    );
  }, []);

  useUpdateCheck({
    onUpdateAvailable: () => {
      console.log('📱 Update is being downloaded in the background');
    },
    onUpdateFetched: () => {
      console.log('📥 Update ready - will be applied on next app restart');
    },
    onError: error => {
      console.error('⚠️ Update check failed:', error.message);
    },
  });

  const [robotoFontsLoaded] = useRobotoFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  const [rubikFontsLoaded] = useRubikFonts({
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
  });

  if (!robotoFontsLoaded || !rubikFontsLoaded) {
    return <></>;
  }

  return <Routes />;
}

export default Sentry.wrap(function App() {
  return (
    <AlertProvider>
      <DatabaseProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </DatabaseProvider>
    </AlertProvider>
  );
});
