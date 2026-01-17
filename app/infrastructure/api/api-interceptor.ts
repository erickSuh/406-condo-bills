import { AlertMessage } from '../../shared/context/AlertContext';

type AlertCallback = (alert: AlertMessage) => void;

let globalAlertCallback: AlertCallback | null = null;

export const registerAlertCallback = (callback: AlertCallback) => {
  globalAlertCallback = callback;
};

export const triggerAlert = (alert: AlertMessage) => {
  if (globalAlertCallback) {
    globalAlertCallback(alert);
  } else {
    console.warn('Alert callback not registered. Alert:', alert);
  }
};

export const errorInterceptor = (
  endpoint: string,
  method: string,
  error: any,
) => {
  let title = 'Error';
  let message = 'An unexpected error occurred';
  let type: 'error' | 'warning' | 'info' = 'error';

  if (error instanceof Error) {
    const errorMessage = error.message;

    if (errorMessage.includes('HTTP Error: 401')) {
      title = 'Unauthorized';
      message = 'Your session has expired. Please log in again.';
      type = 'warning';
    } else if (errorMessage.includes('HTTP Error: 403')) {
      title = 'Forbidden';
      message = 'You do not have permission to access this resource.';
      type = 'warning';
    } else if (errorMessage.includes('HTTP Error: 404')) {
      title = 'Not Found';
      message = 'The requested resource was not found.';
      type = 'warning';
    } else if (errorMessage.includes('HTTP Error: 500')) {
      title = 'Server Error';
      message = 'The server encountered an error. Please try again later.';
      type = 'error';
    } else if (errorMessage.includes('HTTP Error: 400')) {
      title = 'Bad Request';
      message = 'The request was invalid. Please check your input.';
      type = 'warning';
    } else if (
      errorMessage.includes('Network') ||
      errorMessage.includes('Failed to fetch')
    ) {
      title = 'Network Error';
      message =
        'Unable to connect to the server. Please check your internet connection.';
      type = 'warning';
    } else {
      message = errorMessage;
    }
  }

  if (__DEV__) {
    console.error(`[API Error] ${method} ${endpoint}`, error);
  }

  triggerAlert({
    title,
    message,
    type,
  });

  throw error;
};
