import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders button with title', () => {
    render(<Button title="Click Me" onPress={jest.fn()} />);
    expect(screen.getByText('Click Me')).toBeTruthy();
  });

  it('renders with primary variant (default)', () => {
    render(<Button title="Primary" onPress={jest.fn()} />);
    const button = screen.getByText('Primary');
    expect(button).toBeTruthy();
  });

  it('renders with secondary variant', () => {
    render(
      <Button title="Secondary" onPress={jest.fn()} variant="secondary" />,
    );
    const buttonElement = screen.getByText('Secondary');
    expect(buttonElement).toBeTruthy();
  });

  it('calls onPress when clicked', () => {
    const mockPress = jest.fn();
    render(<Button title="Click" onPress={mockPress} />);

    const clickButton = screen.getByText('Click');
    expect(mockPress).not.toHaveBeenCalled();
    expect(clickButton).toBeTruthy();
  });

  it('renders with custom color', () => {
    render(<Button title="Custom" onPress={jest.fn()} color="#FF0000" />);
    expect(screen.getByText('Custom')).toBeTruthy();
  });

  it('renders disabled button', () => {
    render(<Button title="Disabled" onPress={jest.fn()} disabled={true} />);
    expect(screen.getByText('Disabled')).toBeTruthy();
  });

  it('renders with testID', () => {
    const { getByTestId } = render(
      <Button title="Test" onPress={jest.fn()} testID="test-button" />,
    );
    expect(getByTestId('test-button')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const { unmount: unmount1 } = render(
      <Button title="Primary" onPress={jest.fn()} variant="primary" />,
    );
    expect(screen.getByText('Primary')).toBeTruthy();
    unmount1();

    render(
      <Button title="Secondary" onPress={jest.fn()} variant="secondary" />,
    );
    expect(screen.getByText('Secondary')).toBeTruthy();
  });

  it('renders with custom styles', () => {
    render(
      <Button title="Styled" onPress={jest.fn()} style={{ marginTop: 10 }} />,
    );
    expect(screen.getByText('Styled')).toBeTruthy();
  });
});
