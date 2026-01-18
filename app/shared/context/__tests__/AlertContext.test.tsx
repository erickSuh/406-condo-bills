import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Alert } from 'react-native';
import { AlertProvider, useAlert, AlertMessage } from '../AlertContext';

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

const TestComponent: React.FC = () => {
  const { showAlert } = useAlert();

  return (
    <div
      data-testid="test-alert-component"
      onClick={() =>
        showAlert({
          title: 'Test Title',
          message: 'Test Message',
          type: 'error',
        })
      }
    >
      Show Alert
    </div>
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
          <div>Test Content</div>
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
      const { getByText } = render(
        <AlertProvider>
          <TestComponent />
        </AlertProvider>,
      );
      expect(getByText('Show Alert')).toBeTruthy();
    });
  });

  describe('showAlert Function', () => {
    it('should show native alert for error type', () => {
      const ConsoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      render(
        <AlertProvider>
          <TestComponent />
        </AlertProvider>,
      );

      const component = screen.getByText('Show Alert');
      component.click?.();

      expect(Alert.alert).toHaveBeenCalledWith(
        'Test Title',
        'Test Message',
        expect.any(Array),
      );

      ConsoleLogSpy.mockRestore();
    });

    it('should show native alert for warning type', () => {
      const WarningComponent: React.FC = () => {
        const { showAlert } = useAlert();
        return (
          <div
            data-testid="warning-component"
            onClick={() =>
              showAlert({
                title: 'Warning Title',
                message: 'Warning Message',
                type: 'warning',
              })
            }
          >
            Show Warning
          </div>
        );
      };

      render(
        <AlertProvider>
          <WarningComponent />
        </AlertProvider>,
      );

      const component = screen.getByText('Show Warning');
      component.click?.();

      expect(Alert.alert).toHaveBeenCalled();
    });

    it('should log success messages', () => {
      const ConsoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const SuccessComponent: React.FC = () => {
        const { showAlert } = useAlert();
        return (
          <div
            data-testid="success-component"
            onClick={() =>
              showAlert({
                title: 'Success',
                message: 'Operation completed',
                type: 'success',
              })
            }
          >
            Show Success
          </div>
        );
      };

      render(
        <AlertProvider>
          <SuccessComponent />
        </AlertProvider>,
      );

      const component = screen.getByText('Show Success');
      component.click?.();

      expect(ConsoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[SUCCESS]'),
      );

      ConsoleLogSpy.mockRestore();
    });

    it('should log info messages', () => {
      const ConsoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const InfoComponent: React.FC = () => {
        const { showAlert } = useAlert();
        return (
          <div
            data-testid="info-component"
            onClick={() =>
              showAlert({
                title: 'Info',
                message: 'Information message',
                type: 'info',
              })
            }
          >
            Show Info
          </div>
        );
      };

      render(
        <AlertProvider>
          <InfoComponent />
        </AlertProvider>,
      );

      const component = screen.getByText('Show Info');
      component.click?.();

      expect(ConsoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
      );

      ConsoleLogSpy.mockRestore();
    });

    it('should handle alert with duration property', () => {
      const ConsoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const DurationComponent: React.FC = () => {
        const { showAlert } = useAlert();
        return (
          <div
            data-testid="duration-component"
            onClick={() =>
              showAlert({
                title: 'Timed',
                message: 'This alert has a duration',
                type: 'info',
                duration: 3000,
              })
            }
          >
            Show Timed Alert
          </div>
        );
      };

      render(
        <AlertProvider>
          <DurationComponent />
        </AlertProvider>,
      );

      const component = screen.getByText('Show Timed Alert');
      component.click?.();

      expect(ConsoleLogSpy).toHaveBeenCalled();
      ConsoleLogSpy.mockRestore();
    });
  });

  describe('AlertMessage Interface', () => {
    it('should handle all alert type variations', () => {
      const ConsoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const types: AlertMessage['type'][] = [
        'success',
        'error',
        'warning',
        'info',
      ];

      types.forEach(type => {
        const MultiTypeComponent: React.FC = () => {
          const { showAlert } = useAlert();
          return (
            <div
              data-testid={`${type}-component`}
              onClick={() =>
                showAlert({
                  title: `${type} Title`,
                  message: `${type} Message`,
                  type,
                })
              }
            >
              Show {type}
            </div>
          );
        };

        const { unmount } = render(
          <AlertProvider>
            <MultiTypeComponent />
          </AlertProvider>,
        );

        const component = screen.getByText(`Show ${type}`);
        component.click?.();

        unmount();
      });

      expect(ConsoleLogSpy.mock.calls.length).toBeGreaterThan(0);
      ConsoleLogSpy.mockRestore();
    });
  });
});
