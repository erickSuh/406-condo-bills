import { useEffect, useCallback } from 'react';
import * as Sentry from '@sentry/react-native';

interface SentryConfig {
  userId?: string;
  email?: string;
  username?: string;
}

export const useSentry = (config?: SentryConfig) => {
  useEffect(() => {
    if (config?.userId) {
      Sentry.setUser({
        id: config.userId,
        email: config.email,
        username: config.username,
      });
    }

    return () => {
      Sentry.setUser(null);
    };
  }, [config?.userId, config?.email, config?.username]);

  const trackEvent = useCallback(
    (
      message: string,
      category: string = 'user-action',
      level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
      data?: Record<string, any>,
    ) => {
      Sentry.captureMessage(message, {
        level,
        tags: { category },
        extra: data,
      });
    },
    [],
  );

  const reportError = useCallback(
    (error: Error, context?: Record<string, any>) => {
      Sentry.captureException(error, {
        extra: context,
      });
    },
    [],
  );

  return {
    trackEvent,
    reportError,
  };
};
