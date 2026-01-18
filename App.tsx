import React, { Suspense, useEffect } from 'react';
import Routes from './app/routes';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { AlertProvider } from './app/shared/context/AlertContext';
import { ErrorBoundary } from './app/shared/context/ErrorBoundary';
import { initializeDatabase } from './app/infrastructure/database';
import { DatabaseProvider } from '@/shared/context/DatabaseContext';
import './app/infrastructure/i18n';

function AppContent() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return <></>;
  }

  return <Routes />;
}

export default function App() {
  return (
    <AlertProvider>
      <DatabaseProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </DatabaseProvider>
    </AlertProvider>
  );
}
