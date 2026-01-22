import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';
import { AlertProvider, useAlert } from '../AlertContext';

const TestComponent: React.FC = () => {
  const { showAlert } = useAlert();

  return (
    <Pressable
      testID="test-alert-component"
      onPress={() =>
        showAlert({
          title: 'Test Title',
          message: 'Test Message',
          type: 'error',
        })
      }
    >
      <Text>Show Alert</Text>
    </Pressable>
  );
};

describe('AlertContext and useAlert Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AlertProvider', () => {
    it('should render children without errors', () => {
      render(
        <AlertProvider>
          <Text>Test Content</Text>
        </AlertProvider>,
      );
      expect(screen.getByText('Test Content')).toBeTruthy();
    });

    it('should provide alert context to children', () => {
      render(
        <AlertProvider>
          <TestComponent />
        </AlertProvider>,
      );
      expect(screen.getByText('Show Alert')).toBeTruthy();
    });
  });

  describe('useAlert Hook', () => {
    it('should throw error when used outside of AlertProvider', () => {
      const OriginalError = console.error;
      console.error = jest.fn();

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAlert must be used within an AlertProvider');

      console.error = OriginalError;
    });

    it('should return showAlert function', () => {
      render(
        <AlertProvider>
          <TestComponent />
        </AlertProvider>,
      );
      expect(screen.getByText('Show Alert')).toBeTruthy();
    });
  });

  describe('showAlert Function', () => {
    it('should display AlertDialog when showAlert is called', async () => {
      render(
        <AlertProvider>
          <TestComponent />
        </AlertProvider>,
      );

      const button = screen.getByTestId('test-alert-component');
      fireEvent.press(button);

      await waitFor(() => {
        expect(screen.getByText('Test Title')).toBeTruthy();
        expect(screen.getByText('Test Message')).toBeTruthy();
      });
    });
  });
});
