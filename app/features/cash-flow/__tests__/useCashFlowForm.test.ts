import { renderHook } from '@testing-library/react';
import { useCashFlowForm } from '../hooks/useCashFlowForm';

jest.mock('@/shared/context/AlertContext', () => ({
  useAlert: () => ({
    showAlert: jest.fn(),
  }),
}));

jest.mock('@/shared/context/DatabaseContext', () => ({
  useDatabase: (): any => ({
    db: null,
  }),
}));

describe('useCashFlowForm', () => {
  it('should return control, errors, handleSubmit and isLoading', () => {
    const { result } = renderHook(() => useCashFlowForm());

    expect(result.current.control).toBeDefined();
    expect(result.current.errors).toBeDefined();
    expect(result.current.handleSubmit).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('should have default form values', () => {
    const { result } = renderHook(() => useCashFlowForm());

    expect(result.current.control._formValues).toEqual({
      parentAccountId: '1',
      code: '',
      title: '',
      type: '0',
      acceptsEntries: '1',
    });
  });

  it('should provide reset function', () => {
    const { result } = renderHook(() => useCashFlowForm());

    expect(result.current.reset).toBeDefined();
    expect(typeof result.current.reset).toBe('function');
  });

  it('should start with isLoading false', () => {
    const { result } = renderHook(() => useCashFlowForm());

    expect(result.current.isLoading).toBe(false);
  });

  it('should have code field', () => {
    const { result } = renderHook(() => useCashFlowForm());

    expect(result.current.control._formValues.code).toBeDefined();
  });

  it('should have title field', () => {
    const { result } = renderHook(() => useCashFlowForm());

    expect(result.current.control._formValues.title).toBeDefined();
  });

  it('should have type field', () => {
    const { result } = renderHook(() => useCashFlowForm());

    expect(result.current.control._formValues.type).toBeDefined();
  });

  it('should have acceptsEntries field', () => {
    const { result } = renderHook(() => useCashFlowForm());

    expect(result.current.control._formValues.acceptsEntries).toBeDefined();
  });

  it('should have parentAccountId field', () => {
    const { result } = renderHook(() => useCashFlowForm());

    expect(result.current.control._formValues.parentAccountId).toBeDefined();
  });

  it('should provide handleSubmit function', () => {
    const { result } = renderHook(() => useCashFlowForm());

    expect(typeof result.current.handleSubmit).toBe('function');
  });
});
