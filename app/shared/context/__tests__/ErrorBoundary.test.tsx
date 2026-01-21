import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import { ErrorBoundary } from '../ErrorBoundary';
import { AlertProvider } from '../AlertContext';

const ThrowError: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <Text>No Error</Text>;
};

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when no error occurs', () => {
    render(
      <AlertProvider>
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      </AlertProvider>,
    );

    expect(screen.getByText('No Error')).toBeTruthy();
  });

  it('should render error fallback when error occurs', () => {
    const OriginalError = console.error;
    console.error = jest.fn();

    render(
      <AlertProvider>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </AlertProvider>,
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeTruthy();

    console.error = OriginalError;
  });

  it('should display error message in fallback UI', () => {
    const OriginalError = console.error;
    console.error = jest.fn();

    const CustomError: React.FC = () => {
      throw new Error('Custom message');
    };

    render(
      <AlertProvider>
        <ErrorBoundary>
          <CustomError />
        </ErrorBoundary>
      </AlertProvider>,
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeTruthy();

    console.error = OriginalError;
  });

  it('should handle multiple error scenarios', () => {
    const OriginalError = console.error;
    console.error = jest.fn();

    const MultiError: React.FC = () => {
      throw new Error('Multiple test error');
    };

    const { unmount } = render(
      <AlertProvider>
        <ErrorBoundary>
          <MultiError />
        </ErrorBoundary>
      </AlertProvider>,
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeTruthy();
    unmount();

    console.error = OriginalError;
  });

  it('should render error boundary with nested children', () => {
    render(
      <AlertProvider>
        <ErrorBoundary>
          <View>
            <Text>Parent View</Text>
            <View>
              <Text>Nested Child</Text>
            </View>
          </View>
        </ErrorBoundary>
      </AlertProvider>,
    );

    expect(screen.getByText('Parent View')).toBeTruthy();
    expect(screen.getByText('Nested Child')).toBeTruthy();
  });

  it('should catch synchronous errors', () => {
    const OriginalError = console.error;
    console.error = jest.fn();

    const SyncError: React.FC = () => {
      throw new Error('Synchronous error');
    };

    render(
      <AlertProvider>
        <ErrorBoundary>
          <SyncError />
        </ErrorBoundary>
      </AlertProvider>,
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeTruthy();

    console.error = OriginalError;
  });
});
