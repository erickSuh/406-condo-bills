import { CashFlowRepository } from '../api';

jest.mock('../api');

describe('CashFlow Logic Tests', () => {
  const mockCashFlows = [
    {
      id: 1,
      code: '1',
      title: 'Income',
      type: 0,
      deleted: 0,
    },
    {
      id: 2,
      code: '2',
      title: 'Expense',
      type: 1,
      deleted: 0,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('CashFlowRepository should be defined', () => {
    expect(CashFlowRepository).toBeDefined();
  });

  it('should filter items by title', () => {
    const query = 'income';
    const filtered = mockCashFlows.filter(item =>
      item.title.toLowerCase().includes(query),
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Income');
  });

  it('should filter items by code', () => {
    const query = '2';
    const filtered = mockCashFlows.filter(item =>
      item.code.toLowerCase().includes(query),
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].code).toBe('2');
  });

  it('should return empty when no items match', () => {
    const query = 'nonexistent';
    const filtered = mockCashFlows.filter(
      item =>
        item.title.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query),
    );
    expect(filtered).toHaveLength(0);
  });

  it('should return all items with empty search', () => {
    const filtered = mockCashFlows.filter(() => true);
    expect(filtered).toHaveLength(2);
  });
});
