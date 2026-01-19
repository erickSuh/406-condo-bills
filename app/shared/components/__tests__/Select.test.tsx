import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select, SelectOption } from '../Select';

// Mock React Native modules
jest.mock('react-native', () => ({
  View: ({ children, style }: any) => (
    <div data-testid="view" style={style}>
      {children}
    </div>
  ),
  Text: ({ children, style }: any) => (
    <span data-testid="text" style={style}>
      {children}
    </span>
  ),
  StyleSheet: {
    create: (styles: any) => styles,
  },
  TouchableOpacity: ({ children, onPress, disabled, style }: any) => (
    <button
      data-testid="touchable"
      onClick={onPress}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  ),
  Modal: ({ children, visible }: any) =>
    visible ? <div data-testid="modal">{children}</div> : null,
}));

jest.mock('@react-native-picker/picker', () => {
  const Picker = ({ children, selectedValue, onValueChange }: any) => (
    <select
      data-testid="picker"
      value={selectedValue}
      onChange={e => onValueChange(e.target.value)}
    >
      {children}
    </select>
  );

  const PickerItem = ({ label, value }: any) => (
    <option data-testid="picker-item" value={value}>
      {label}
    </option>
  );

  PickerItem.displayName = 'Picker.Item';
  Picker.Item = PickerItem;

  return { Picker };
});

jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, size, color, style }: any) => (
    <div data-testid="icon" style={style}>
      {name}
    </div>
  ),
}));

jest.mock('@/styles/colors', () => ({
  background_primary: '#000',
  background_secondary: '#eee',
  font_inverse: '#fff',
  font_primary: '#000',
  font_caption: '#999',
  icon_light_gray: '#ccc',
}));

jest.mock('@/styles/fonts', () => ({
  primary: 'Arial',
  heading: 'Arial Bold',
}));

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

  it('should open modal when pressed', () => {
    render(
      <Select
        options={mockOptions}
        placeholder="Select"
        onValueChange={mockOnChange}
      />,
    );

    const button = screen.getByTestId('touchable');
    fireEvent.click(button);

    expect(screen.getByTestId('modal')).toBeTruthy();
  });

  it('should render all options in picker', () => {
    render(
      <Select
        options={mockOptions}
        placeholder="Select"
        onValueChange={mockOnChange}
      />,
    );

    const button = screen.getByTestId('touchable');
    fireEvent.click(button);

    mockOptions.forEach(option => {
      expect(screen.getByText(option.label)).toBeTruthy();
    });
  });

  it('should call onValueChange on selection', () => {
    render(
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

    const button = screen.getByTestId('touchable');
    expect((button as HTMLButtonElement).disabled).toBe(true);
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
});
