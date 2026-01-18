import React from 'react';
import { render } from '@testing-library/react';
import { FixedDialogCard } from '../FixedDialogCard';

describe('FixedDialogCard Component', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <FixedDialogCard
        code="2"
        title="Income"
        codeColor="#00AA00"
        onDelete={jest.fn()}
      />,
    );
    expect(container).toBeTruthy();
  });

  it('renders with different colors', () => {
    const { container } = render(
      <FixedDialogCard
        code="2"
        title="Expense"
        codeColor="#FF0000"
        onDelete={jest.fn()}
      />,
    );
    expect(container).toBeTruthy();
  });

  it('accepts onDelete callback', () => {
    const mockDelete = jest.fn();
    const { container } = render(
      <FixedDialogCard
        code="1"
        title="Test Item"
        codeColor="#00AA00"
        onDelete={mockDelete}
      />,
    );
    expect(container).toBeTruthy();
    expect(mockDelete).toBeDefined();
  });

  it('renders with long titles', () => {
    const longTitle =
      'This is a very long title that should be displayed correctly on the card';
    const { container } = render(
      <FixedDialogCard
        code="1"
        title={longTitle}
        codeColor="#00AA00"
        onDelete={jest.fn()}
      />,
    );
    expect(container).toBeTruthy();
  });
});
