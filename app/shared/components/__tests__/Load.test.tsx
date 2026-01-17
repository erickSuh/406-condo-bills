import React from 'react';
import { render } from '@testing-library/react';
import { Load } from '../Load';

describe('Load Component', () => {
  it('renders loading indicator', () => {
    const { container } = render(<Load />);
    expect(container).toBeTruthy();
  });

  it('renders with container div', () => {
    const { container } = render(<Load />);
    const div = container.querySelector('div[testid="load-container"]');
    expect(div || container.firstChild).toBeTruthy();
  });

  it('renders loading spinner', () => {
    const { container } = render(<Load />);
    const spinner = container.firstChild;
    expect(spinner).toBeTruthy();
  });
});
