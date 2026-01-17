import React, { Suspense, useEffect } from 'react';
import Routes from './app/routes';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { AlertProvider, useAlert } from './app/shared/context/AlertContext';
import { ErrorBoundary } from './app/shared/context/ErrorBoundary';
import { registerAlertCallback } from './app/infrastructure/api/api-interceptor';
import { initializeDatabase } from './app/infrastructure/database';
import { DatabaseProvider } from '@/shared/context/DatabaseContext';

function AppContent() {
  const { showAlert } = useAlert();

  useEffect(() => {
    registerAlertCallback(showAlert);
  }, [showAlert]);

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
    <DatabaseProvider>
      <ErrorBoundary>
        <AlertProvider>
          <AppContent />
        </AlertProvider>
      </ErrorBoundary>
    </DatabaseProvider>
  );
}
