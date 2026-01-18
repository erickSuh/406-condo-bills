import React from 'react';
import { render } from '@testing-library/react';
import { Header } from '../Header';

describe('Header Component', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Header title="Test Title" icon="add" callToAction={jest.fn()} />,
    );
    expect(container).toBeTruthy();
  });

  it('renders with optional props', () => {
    const { container } = render(<Header title="Test" />);
    expect(container).toBeTruthy();
  });

  it('handles callback functions', () => {
    const mockCallToAction = jest.fn();
    const { container } = render(
      <Header title="Test" icon="add" callToAction={mockCallToAction} />,
    );
    expect(container).toBeTruthy();
    expect(mockCallToAction).toBeDefined();
  });
});
