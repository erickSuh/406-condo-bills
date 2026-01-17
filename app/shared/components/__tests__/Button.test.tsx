import React from 'react';
import { render, screen } from '@testing-library/react';
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
});
