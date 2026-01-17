import React from 'react';
import { render, screen } from '@testing-library/react';
import { Input } from '../Input';

describe('Input Component', () => {
  it('renders input with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('renders input field', () => {
    render(<Input placeholder="Test input" />);
    const inputElement = screen.getByPlaceholderText('Test input');
    expect(inputElement).toBeTruthy();
  });

  it('renders with value', () => {
    render(<Input placeholder="Test" value="Hello" />);
    const inputWithValue = screen.getByDisplayValue('Hello');
    expect(inputWithValue).toBeTruthy();
  });

  it('accepts disabled prop', () => {
    render(<Input placeholder="Disabled" editable={false} />);
    const disabledInput = screen.getByPlaceholderText('Disabled');
    expect(disabledInput).toBeTruthy();
  });
});
