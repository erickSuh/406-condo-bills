import React, { createContext, useContext, useCallback, useState } from 'react';
import { AlertDialog } from '@/shared/components/AlertDialog';

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
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showAlert = useCallback((alertMessage: AlertMessage) => {
    setAlert(alertMessage);
    setIsVisible(true);

    if (alertMessage.type !== 'error' && alertMessage.type !== 'warning') {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
  }, []);

  const value: AlertContextType = {
    showAlert,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      {alert && (
        <AlertDialog
          visible={isVisible}
          title={alert.title}
          message={alert.message}
          type={alert.type}
          onDismiss={handleDismiss}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
