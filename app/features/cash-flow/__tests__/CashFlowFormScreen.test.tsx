import React from 'react';
import { render, waitFor } from './testUtils';
import { CashFlowFormScreen } from '../screens/CashFlowFormScreen';

describe('CashFlowFormScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display screen with title text', async () => {
    const { getByText, getByTestId, unmount } = render(<CashFlowFormScreen />);

    await waitFor(() => expect(getByText('Inserir Conta')).toBeDefined(), {
      timeout: 2000,
    });
    expect(getByText('Conta pai')).toBeDefined();
    expect(getByText('Código')).toBeDefined();
    expect(getByText('Nome')).toBeDefined();
    expect(getByText('Tipo')).toBeDefined();
    expect(getByText('Aceita lançamentos')).toBeDefined();
    expect(getByTestId('back-button')).toBeDefined();
    unmount();
  });
});
