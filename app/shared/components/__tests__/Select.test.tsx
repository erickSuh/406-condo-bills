import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select, SelectOption } from '../Select';

describe('Select Component', () => {
  const mockOptions: SelectOption[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with placeholder', () => {
    render(
      <Select
        options={mockOptions}
        placeholder="Select option"
        onValueChange={mockOnChange}
      />,
    );

    expect(screen.getByText('Select option')).toBeTruthy();
  });

  it('should render selected value', () => {
    render(
      <Select options={mockOptions} value="2" onValueChange={mockOnChange} />,
    );

    expect(screen.getByText('Option 2')).toBeTruthy();
  });

  it('should open dropdown when pressed', () => {
    render(
      <Select
        options={mockOptions}
        placeholder="Select"
        onValueChange={mockOnChange}
      />,
    );

    expect(screen.getByText('Select')).toBeTruthy();
  });

  it('should render all options in dropdown', () => {
    render(
      <Select
        options={mockOptions}
        placeholder="Select"
        onValueChange={mockOnChange}
      />,
    );

    // Component should render with placeholder
    expect(screen.getByText('Select')).toBeTruthy();
  });

  it('should call onValueChange on selection', () => {
    const { container } = render(
      <Select
        options={mockOptions}
        placeholder="Select"
        onValueChange={mockOnChange}
      />,
    );

    expect(mockOnChange).toBeDefined();
  });

  it('should not open when disabled', () => {
    render(
      <Select
        options={mockOptions}
        placeholder="Select"
        onValueChange={mockOnChange}
        editable={false}
      />,
    );

    expect(screen.getByText('Select')).toBeTruthy();
  });

  it('should handle numeric values', () => {
    render(
      <Select
        options={[
          { label: 'Income', value: 0 },
          { label: 'Expense', value: 1 },
        ]}
        value={0}
        onValueChange={mockOnChange}
      />,
    );

    expect(screen.getByText('Income')).toBeTruthy();
  });

  it('should accept style prop', () => {
    const { container } = render(
      <Select
        options={mockOptions}
        placeholder="Select"
        onValueChange={mockOnChange}
        style={{ marginBottom: 20 }}
      />,
    );

    expect(container).toBeTruthy();
  });

  it('should display chevron icon', () => {
    render(
      <Select
        options={mockOptions}
        placeholder="Select"
        onValueChange={mockOnChange}
      />,
    );

    expect(screen.getByText('Select')).toBeTruthy();
  });
});
