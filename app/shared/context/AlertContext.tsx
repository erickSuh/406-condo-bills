import React, { createContext, useContext, useCallback } from 'react';
import { Alert } from 'react-native';

export interface AlertMessage {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface AlertContextType {
  showAlert: (alert: AlertMessage) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const showAlert = useCallback((alert: AlertMessage) => {
    // Only show native alert for errors and warnings
    if (alert.type === 'error' || alert.type === 'warning') {
      Alert.alert(alert.title, alert.message, [
        {
          text: 'OK',
          onPress: () => {},
        },
      ]);
    }

    // For success and info, just log them
    console.log(
      `[${alert.type.toUpperCase()}] ${alert.title}: ${alert.message}`,
    );
  }, []);

  const value: AlertContextType = {
    showAlert,
  };

  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
