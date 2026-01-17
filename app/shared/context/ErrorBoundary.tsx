import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAlert } from './AlertContext';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (__DEV__) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback error={this.state.error} onReset={this.handleReset} />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReset }) => {
  const { showAlert } = useAlert();

  React.useEffect(() => {
    if (error) {
      showAlert({
        title: 'Application Error',
        message: error.message || 'An unexpected error occurred',
        type: 'error',
      });
    }
  }, [error, showAlert]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Oops! Something went wrong
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: '#666',
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        {error?.message || 'An unexpected error occurred'}
      </Text>
      <TouchableOpacity
        onPress={onReset}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: '#007AFF',
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};
