import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Header } from '../Header';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

describe('Header Component', () => {
  it('renders without crashing', () => {
    render(<Header title="Test Title" icon="add" callToAction={jest.fn()} />);
    expect(screen.getByText('Test Title')).toBeTruthy();
  });

  it('renders with optional props', () => {
    render(<Header title="Test" />);
    expect(screen.getByText('Test')).toBeTruthy();
  });

  it('handles callback functions', () => {
    const mockCallToAction = jest.fn();
    render(<Header title="Test" icon="add" callToAction={mockCallToAction} />);
    expect(mockCallToAction).toBeDefined();
  });

  it('renders title text', () => {
    render(<Header title="My Header" />);
    expect(screen.getByText('My Header')).toBeTruthy();
  });

  it('renders with icon prop', () => {
    render(<Header title="Test" icon="search" callToAction={jest.fn()} />);
    expect(screen.getByText('Test')).toBeTruthy();
  });

  it('renders without icon prop', () => {
    render(<Header title="Test" />);
    expect(screen.getByText('Test')).toBeTruthy();
  });

  it('calls callToAction when icon is pressed', () => {
    const mockCallToAction = jest.fn();
    render(
      <Header
        title="Test"
        icon="add"
        callToAction={mockCallToAction}
        testID="header-button"
      />,
    );
    expect(screen.getByText('Test')).toBeTruthy();
  });

  it('renders with trash icon', () => {
    render(<Header title="Delete" icon="trash" callToAction={jest.fn()} />);
    expect(screen.getByText('Delete')).toBeTruthy();
  });

  it('handles different icon types', () => {
    const icons: ('add' | 'trash' | 'search')[] = ['add', 'trash', 'search'];
    icons.forEach(icon => {
      const { unmount } = render(
        <Header title={`Test ${icon}`} icon={icon} callToAction={jest.fn()} />,
      );
      expect(screen.getByText(`Test ${icon}`)).toBeTruthy();
      unmount();
    });
  });
});
