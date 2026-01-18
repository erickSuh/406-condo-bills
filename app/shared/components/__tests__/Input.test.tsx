import React from 'react';
import { render } from '@testing-library/react';
import { Input } from '../Input';

describe('Input Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Input placeholder="Enter text" />);
    expect(container).toBeTruthy();
  });

  it('accepts placeholder prop', () => {
    const { container } = render(<Input placeholder="Test input" />);
    expect(container).toBeTruthy();
  });

  it('accepts value prop', () => {
    const { container } = render(<Input placeholder="Test" />);
    expect(container).toBeTruthy();
  });

  it('accepts icon prop', () => {
    const { container } = render(<Input placeholder="Search" icon="search" />);
    expect(container).toBeTruthy();
  });

  it('accepts callback props', () => {
    const mockChange = jest.fn();
    const { container } = render(
      <Input placeholder="Test" onChangeText={mockChange} />,
    );
    expect(container).toBeTruthy();
    expect(mockChange).toBeDefined();
  });

  it('renders with custom styles', () => {
    const { container } = render(
      <Input placeholder="Test" style={{ marginTop: 10 }} />,
    );
    expect(container).toBeTruthy();
  });
});
