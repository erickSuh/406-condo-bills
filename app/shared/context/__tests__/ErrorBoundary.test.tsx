import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';
import { AlertProvider } from '../AlertContext';

// Mock React Native components
jest.mock('react-native', () => ({
  View: ({ children, style, ...props }: any) => (
    <div style={style} {...props}>
      {children}
    </div>
  ),
  Text: ({ children, style, ...props }: any) => (
    <div style={style} {...props}>
      {children}
    </div>
  ),
  TouchableOpacity: ({ children, onPress, ...props }: any) => (
    <button onClick={onPress} {...props}>
      {children}
    </button>
  ),
  Alert: {
    alert: jest.fn(),
  },
}));

const ThrowError: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No Error</div>;
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
    expect(screen.getByText('Test error')).toBeTruthy();

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

    expect(screen.getByText('Custom message')).toBeTruthy();

    console.error = OriginalError;
  });

  it('should show reset button in error fallback', () => {
    const OriginalError = console.error;
    console.error = jest.fn();

    render(
      <AlertProvider>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </AlertProvider>,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);

    console.error = OriginalError;
  });

  it('should handle nested errors', () => {
    const OriginalError = console.error;
    console.error = jest.fn();

    const NestedError: React.FC = () => {
      throw new Error('Nested error');
    };

    render(
      <AlertProvider>
        <ErrorBoundary>
          <div>
            <NestedError />
          </div>
        </ErrorBoundary>
      </AlertProvider>,
    );

    expect(screen.getByText('Nested error')).toBeTruthy();

    console.error = OriginalError;
  });

  it('should render styled error container', () => {
    const OriginalError = console.error;
    console.error = jest.fn();

    const { container } = render(
      <AlertProvider>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </AlertProvider>,
    );

    // Should have rendered a container with error UI
    expect(container.querySelector('button')).toBeTruthy();

    console.error = OriginalError;
  });
});
