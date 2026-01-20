import React from 'react';
import { render, waitFor } from './testUtils';
import { CashFlowListScreen } from '../screens/CashFlowListScreen';

describe('CashFlowListScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { unmount } = render(<CashFlowListScreen />);
    expect(true).toBe(true);
    unmount();
  });

  it('should display screen with title text', async () => {
    const { getByText, getByTestId, queryByTestId, unmount } = render(
      <CashFlowListScreen />,
    );

    await waitFor(() => expect(getByText('Plano de Contas')).toBeDefined(), {
      timeout: 2000,
    });
    expect(getByTestId('search-input')).toBeDefined();
    expect(getByText('Listagem')).toBeDefined();
    expect(getByText('0 registros')).toBeDefined();
    expect(getByText('Nenhuma conta encontrada')).toBeDefined();
    expect(queryByTestId('back-button')).toBeNull();
    expect(getByTestId('header-action-button')).toBeDefined();
    unmount();
  });
});
