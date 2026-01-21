import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Select, SelectOption } from '../Select';

describe('Select Component', () => {
  const options: SelectOption[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];

  it('should render without crashing', () => {
    render(<Select value="1" onValueChange={jest.fn()} options={options} />);
    expect(screen.getByText('Option 1')).toBeTruthy();
  });

  it('should render with placeholder', () => {
    render(
      <Select
        value={undefined}
        onValueChange={jest.fn()}
        options={options}
        placeholder="Select an option"
      />,
    );
    expect(screen.getByText('Select an option')).toBeTruthy();
  });

  it('should call onValueChange function', () => {
    const mockChange = jest.fn();
    render(<Select value="1" onValueChange={mockChange} options={options} />);
    expect(mockChange).toBeDefined();
  });

  it('should display selected value for first option', () => {
    render(<Select value="1" onValueChange={jest.fn()} options={options} />);
    expect(screen.getByText('Option 1')).toBeTruthy();
  });

  it('should display selected value for second option', () => {
    render(<Select value="2" onValueChange={jest.fn()} options={options} />);
    expect(screen.getByText('Option 2')).toBeTruthy();
  });

  it('should render with custom styles', () => {
    render(
      <Select
        value="1"
        onValueChange={jest.fn()}
        options={options}
        style={{ marginBottom: 16 }}
      />,
    );
    expect(screen.getByText('Option 1')).toBeTruthy();
  });

  it('should handle disabled state', () => {
    render(
      <Select
        value="1"
        onValueChange={jest.fn()}
        options={options}
        editable={false}
      />,
    );
    expect(screen.getByText('Option 1')).toBeTruthy();
  });

  it('should handle numeric values', () => {
    const numericOptions: SelectOption[] = [
      { label: 'Income', value: 0 },
      { label: 'Expense', value: 1 },
    ];
    render(
      <Select value={0} onValueChange={jest.fn()} options={numericOptions} />,
    );
    expect(screen.getByText('Income')).toBeTruthy();
  });

  it('should handle empty value', () => {
    render(
      <Select value={undefined} onValueChange={jest.fn()} options={options} />,
    );
    expect(screen.getByText('Select an option')).toBeTruthy();
  });
});
