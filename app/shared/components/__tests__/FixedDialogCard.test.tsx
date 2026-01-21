import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { FixedDialogCard } from '../FixedDialogCard';

describe('FixedDialogCard Component', () => {
  it('renders without crashing', () => {
    render(
      <FixedDialogCard
        code="2"
        title="Income"
        codeColor="#00AA00"
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText('2 - Income')).toBeTruthy();
  });

  it('renders with different colors', () => {
    render(
      <FixedDialogCard
        code="2"
        title="Expense"
        codeColor="#FF0000"
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText('2 - Expense')).toBeTruthy();
  });

  it('accepts onDelete callback', () => {
    const mockDelete = jest.fn();
    render(
      <FixedDialogCard
        code="1"
        title="Test Item"
        codeColor="#00AA00"
        onDelete={mockDelete}
      />,
    );
    expect(mockDelete).toBeDefined();
    expect(screen.getByText('1 - Test Item')).toBeTruthy();
  });

  it('renders with long titles', () => {
    const longTitle =
      'This is a very long title that should be displayed correctly on the card';
    render(
      <FixedDialogCard
        code="1"
        title={longTitle}
        codeColor="#00AA00"
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText(`1 - ${longTitle}`)).toBeTruthy();
  });

  it('renders with empty code string', () => {
    render(
      <FixedDialogCard
        code=""
        title="Title Only"
        codeColor="#00AA00"
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText('Title Only')).toBeTruthy();
  });

  it('renders with default color when codeColor is not provided', () => {
    render(
      <FixedDialogCard code="1" title="Default Color" onDelete={jest.fn()} />,
    );
    expect(screen.getByText('1 - Default Color')).toBeTruthy();
  });

  it('renders with numeric code', () => {
    render(
      <FixedDialogCard
        code="999"
        title="High Code"
        codeColor="#0000FF"
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText('999 - High Code')).toBeTruthy();
  });

  it('renders with single character code', () => {
    render(
      <FixedDialogCard
        code="A"
        title="Letter Code"
        codeColor="#00AA00"
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText('A - Letter Code')).toBeTruthy();
  });
});
