import { useCashFlowFormScreen } from './../hooks/useCashFlowFormScreen';
import { renderHook } from '@testing-library/react-native';

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

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

describe('useCashFlowForm', () => {
  it('should return control, errors, handleSubmit and isLoading', () => {
    const { result } = renderHook(() => useCashFlowFormScreen());

    expect(result.current.control).toBeDefined();
    expect(result.current.errors).toBeDefined();
    expect(result.current.handleSubmit).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('should have default form values', () => {
    const { result } = renderHook(() => useCashFlowFormScreen());

    expect(result.current.control._formValues).toEqual({
      parentAccountId: undefined,
      code: '',
      title: '',
      type: '0',
      acceptsEntries: 0,
    });
  });

  it('should provide reset function', () => {
    const { result } = renderHook(() => useCashFlowFormScreen());

    expect(result.current.reset).toBeDefined();
    expect(typeof result.current.reset).toBe('function');
  });

  it('should start with isLoading false', () => {
    const { result } = renderHook(() => useCashFlowFormScreen());

    expect(result.current.isLoading).toBe(false);
  });

  it('should have code field', () => {
    const { result } = renderHook(() => useCashFlowFormScreen());

    expect(result.current.control._formValues.code).toBeDefined();
  });

  it('should have title field', () => {
    const { result } = renderHook(() => useCashFlowFormScreen());

    expect(result.current.control._formValues.title).toBeDefined();
  });

  it('should have type field', () => {
    const { result } = renderHook(() => useCashFlowFormScreen());

    expect(result.current.control._formValues.type).toBeDefined();
  });

  it('should have acceptsEntries field', () => {
    const { result } = renderHook(() => useCashFlowFormScreen());

    expect(result.current.control._formValues.acceptsEntries).toBeDefined();
  });

  it('should have parentAccountId field', () => {
    const { result } = renderHook(() => useCashFlowFormScreen());

    expect(result.current.control._formValues.parentAccountId).toBeUndefined();
  });

  it('should provide handleSubmit function', () => {
    const { result } = renderHook(() => useCashFlowFormScreen());

    expect(typeof result.current.handleSubmit).toBe('function');
  });
});
