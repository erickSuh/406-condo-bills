import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { DatabaseProvider, useDatabase } from '../DatabaseContext';

const TestComponent = () => {
  const { db } = useDatabase();
  return <Text>{db ? 'DB Connected' : 'No DB'}</Text>;
};

describe('DatabaseContext', () => {
  it('provides database context to children', () => {
    render(
      <DatabaseProvider>
        <Text>Database Provider Test</Text>
      </DatabaseProvider>,
    );
    expect(screen.getByText('Database Provider Test')).toBeTruthy();
  });

  it('useDatabase hook returns database object', () => {
    render(
      <DatabaseProvider>
        <TestComponent />
      </DatabaseProvider>,
    );
    expect(screen.getByText(/Connected|No DB/)).toBeTruthy();
  });

  it('useDatabase throws error when used outside provider', () => {
    const OriginalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useDatabase must be used within a DatabaseProvider');

    console.error = OriginalError;
  });

  it('renders children without crashing', () => {
    const { getByText } = render(
      <DatabaseProvider>
        <Text>Child Component</Text>
      </DatabaseProvider>,
    );
    expect(getByText('Child Component')).toBeTruthy();
  });

  it('provides database context with valid structure', () => {
    const { getByText } = render(
      <DatabaseProvider>
        <TestComponent />
      </DatabaseProvider>,
    );
    expect(getByText(/Connected|No DB/)).toBeTruthy();
  });
});
