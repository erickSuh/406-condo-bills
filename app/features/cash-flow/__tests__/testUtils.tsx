import React, { ReactElement, useEffect } from 'react';
import {
  render as rtlRender,
  RenderOptions,
} from '@testing-library/react-native';
import { AlertProvider } from '@/shared/context/AlertContext';
import { ErrorBoundary } from '@/shared/context/ErrorBoundary';
import { DatabaseProvider } from '@/shared/context/DatabaseContext';
import { initializeDatabase } from '@/infrastructure/database';
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

/**
 * AppWrapper - Contains all providers needed for testing
 * Includes: AlertProvider, DatabaseProvider, ErrorBoundary, Font loading
 */
interface AppWrapperProps {
  children: React.ReactNode;
}

function AppWrapper({ children }: AppWrapperProps) {
  useEffect(() => {
    initializeDatabase().catch(error =>
      console.error('Failed to initialize database:', error),
    );
  }, []);

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

  return (
    <AlertProvider>
      <DatabaseProvider>
        <ErrorBoundary>{children}</ErrorBoundary>
      </DatabaseProvider>
    </AlertProvider>
  );
}

/**
 * Custom render function that includes all providers
 * Use this instead of the standard render() in tests
 *
 * @example
 * const { getByText } = render(<CashFlowListScreen />);
 */
function render(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return rtlRender(ui, { wrapper: AppWrapper, ...options });
}

export * from '@testing-library/react-native';
export { render };
