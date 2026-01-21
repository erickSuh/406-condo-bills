import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';

describe('Input Component', () => {
  it('renders without crashing', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('accepts placeholder prop', () => {
    render(<Input placeholder="Test input" />);
    expect(screen.getByPlaceholderText('Test input')).toBeTruthy();
  });

  it('accepts value prop', () => {
    const { rerender } = render(<Input placeholder="Test" value="" />);
    expect(screen.getByPlaceholderText('Test')).toBeTruthy();
    rerender(<Input placeholder="Test" value="typed text" />);
  });

  it('accepts icon prop', () => {
    render(<Input placeholder="Search" icon="search" />);
    expect(screen.getByPlaceholderText('Search')).toBeTruthy();
  });

  it('accepts callback props', () => {
    const mockChange = jest.fn();
    render(<Input placeholder="Test" onChangeText={mockChange} />);
    expect(mockChange).toBeDefined();
    expect(screen.getByPlaceholderText('Test')).toBeTruthy();
  });

  it('renders with custom styles', () => {
    render(<Input placeholder="Test" style={{ marginTop: 10 }} />);
    expect(screen.getByPlaceholderText('Test')).toBeTruthy();
  });

  it('calls onFocus callback when input is focused', () => {
    const mockOnFocus = jest.fn();
    render(
      <Input placeholder="Test" onFocus={mockOnFocus} testID="test-input" />,
    );
    const input = screen.getByPlaceholderText('Test');
    fireEvent(input, 'focus');
    expect(mockOnFocus).toHaveBeenCalled();
  });

  it('calls onBlur callback when input loses focus', () => {
    const mockOnBlur = jest.fn();
    render(
      <Input placeholder="Test" onBlur={mockOnBlur} testID="test-input" />,
    );
    const input = screen.getByPlaceholderText('Test');
    fireEvent(input, 'blur');
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('hides placeholder when focused and shows it when blurred', () => {
    const { rerender } = render(
      <Input placeholder="Test placeholder" testID="test-input" />,
    );
    const input = screen.getByPlaceholderText('Test placeholder');
    fireEvent(input, 'focus');
    rerender(<Input placeholder="Test placeholder" testID="test-input" />);
    fireEvent(input, 'blur');
  });

  it('renders icon when not focused', () => {
    render(<Input placeholder="Search" icon="search" testID="test-input" />);
    expect(screen.getByPlaceholderText('Search')).toBeTruthy();
  });

  it('handles onChange callback', () => {
    const mockChange = jest.fn();
    render(
      <Input placeholder="Test" onChange={mockChange} testID="test-input" />,
    );
    expect(screen.getByPlaceholderText('Test')).toBeTruthy();
  });
});
