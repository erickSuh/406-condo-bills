# Using the New Single Responsibility Hooks

## Overview

This guide explains how to use the new specialized hooks for cash flow form management. These hooks follow the Single Responsibility Principle and can be used independently or composed together.

## Individual Hook Usage

### 1. useCashFlowData - Data Loading

Use this hook when you need to load and manage cash flow data.

```typescript
import { useCashFlowData } from './hooks/useCashFlowData';

function MyComponent() {
  const { parentItems, flowTypes, isLoading, refetchItems } = useCashFlowData();

  // parentItems: CashFlowItem[] - Available parent accounts
  // flowTypes: FlowType[] - Available flow types
  // isLoading: boolean - Currently loading data
  // refetchItems: () => Promise<void> - Manual refresh function

  return (
    <View>
      {isLoading ? <Text>Loading...</Text> :
        <Text>Loaded {parentItems.length} items</Text>
      }
      <Button
        title="Refresh"
        onPress={refetchItems}
      />
    </View>
  );
}
```

### 2. useCashFlowCodeSuggestion - Code Suggestion

Use this hook to suggest the next code for a parent account with automatic escalation.

```typescript
import { useCashFlowCodeSuggestion } from './hooks/useCashFlowCodeSuggestion';
import { CashFlowItem } from './types';

function SuggestCodeExample() {
  const { suggestCode } = useCashFlowCodeSuggestion();

  const handleSuggest = async (parent: CashFlowItem, parents: CashFlowItem[]) => {
    try {
      const { code, prefix } = await suggestCode(parent, parents);
      console.log(`Suggested code: ${code}`);
      console.log(`Input prefix: ${prefix}`);
      // code: "1" or "1.1" or "1.1.1" etc.
      // prefix: "" or "1." or "1.1." etc.
    } catch (error) {
      console.error('Failed to suggest code:', error);
    }
  };

  return (
    <Button
      title="Suggest Code"
      onPress={() => handleSuggest(parentItem, parentItems)}
    />
  );
}
```

**Important:** The suggestion algorithm implements hierarchical escalation:

- If children use 9.9, next suggestion is 9.10 (not 9.10.1)
- Each segment can be 1-999
- Escalation happens when a segment would exceed 999

### 3. useCashFlowValidation - Code Validation

Use this hook to validate codes with format and uniqueness checks.

```typescript
import { useCashFlowValidation } from './hooks/useCashFlowValidation';

function ValidateCodeExample() {
  const { validateCode } = useCashFlowValidation();

  const handleValidate = async (
    code: string,
    parentId: string,
    parentItems: CashFlowItem[]
  ) => {
    const error = await validateCode(code, parentId, parentItems);

    if (error) {
      console.error('Validation error:', error);
      // "Invalid code format"
      // "Each segment must be less than 1000"
      // "Code already exists"
      // etc.
    } else {
      console.log('Code is valid!');
    }
  };

  // For React Hook Form:
  return (
    <Controller
      name="code"
      control={control}
      rules={{
        validate: async (code) => {
          return await validateCode(code, parentAccountId, parentItems) || true;
        }
      }}
      render={({ field, fieldState: { error } }) => (
        <>
          <Input {...field} />
          {error && <Text>{error.message}</Text>}
        </>
      )}
    />
  );
}
```

**Validation Rules:**

- Format: `/^\d{1,3}(\.\d{1,3})*$/` (e.g., "1.2.345")
- Segments: Each segment must be ≤ 999
- Depth: Must match parent's depth + 1
- Uniqueness: Code can't already exist in database
- Parent: If multi-level, parent must exist

### 4. useCashFlowSubmit - Form Submission

Use this hook to handle form submission and database insertion.

```typescript
import { useCashFlowSubmit } from './hooks/useCashFlowSubmit';
import { useNavigation } from '@react-navigation/native';

function SubmitExample() {
  const navigation = useNavigation();
  const { submitCashFlow } = useCashFlowSubmit(navigation);
  const { refetchItems } = useCashFlowData();

  const handleSubmit = async () => {
    const data = {
      code: '1.2.3',
      title: 'My Account',
      type: 1,
      parentAccountId: 5,
      acceptsEntries: 0
    };

    try {
      await submitCashFlow(data, refetchItems);
      // Shows success alert
      // Refreshes item list
      // Navigates back automatically
    } catch (error) {
      console.error('Submission failed:', error);
      // Shows error alert automatically
    }
  };

  return <Button title="Submit" onPress={handleSubmit} />;
}
```

## Composed Hook Usage (Recommended)

The orchestrator hook `useCashFlowFormScreen` composes all specialized hooks for a complete form solution:

```typescript
import { useCashFlowFormScreen } from './hooks/useCashFlowFormScreen';
import { useRoute } from '@react-navigation/native';

export function CashFlowFormScreen() {
  const {
    // Form control
    control,
    errors,
    handleSubmit,
    reset,
    isLoading,

    // Form data
    parentItems,
    flowTypes,
    acceptsEntriesOptions,
    suggestedPrefix,
    isTypeDisabled,

    // Utilities
    validateCode,
    watch,
    t,

    // Read-only mode
    isReadOnly,
    itemToView,
  } = useCashFlowFormScreen();

  // Use all these values to render your form
  // Example:
  return (
    <View>
      {isReadOnly ? (
        <Text>Read-only view of: {itemToView?.title}</Text>
      ) : (
        <Form
          control={control}
          onSubmit={handleSubmit}
          validateCode={validateCode}
          // ... other props
        />
      )}
    </View>
  );
}
```

## Testing Individual Hooks

### Testing useCashFlowData

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { useCashFlowData } from './hooks/useCashFlowData';

describe('useCashFlowData', () => {
  it('should load parent items', async () => {
    const { result } = renderHook(() => useCashFlowData(), {
      wrapper: DatabaseContextWrapper, // Mock the context
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.parentItems.length).toBeGreaterThan(0);
    });
  });
});
```

### Testing useCashFlowValidation

```typescript
import { renderHook } from '@testing-library/react-native';
import { useCashFlowValidation } from './hooks/useCashFlowValidation';

describe('useCashFlowValidation', () => {
  it('should reject invalid format', async () => {
    const { result } = renderHook(() => useCashFlowValidation(), {
      wrapper: DatabaseContextWrapper,
    });

    const error = await result.current.validateCode('invalid', '1', []);

    expect(error).toBeDefined();
  });

  it('should reject duplicate codes', async () => {
    const { result } = renderHook(() => useCashFlowValidation(), {
      wrapper: DatabaseContextWrapper,
    });

    const error = await result.current.validateCode(
      '1.2.3', // Already exists in DB
      '1',
      mockParentItems,
    );

    expect(error).toContain('already exists');
  });
});
```

## Error Handling

All hooks handle errors gracefully:

### Data Loading Errors

```typescript
const { parentItems, isLoading } = useCashFlowData();
// If error occurs, returns empty array and logs error

if (parentItems.length === 0 && !isLoading) {
  return <Text>Failed to load items</Text>;
}
```

### Validation Errors

```typescript
const error = await validateCode(code, parentId, parentItems);
if (error) {
  // Display error to user
  setFieldError('code', error);
}
```

### Submission Errors

```typescript
try {
  await submitCashFlow(data, refetchItems);
} catch (error) {
  // Alert is shown automatically
  // No need for additional error handling
}
```

## Best Practices

1. **Use Composed Hook in Screens**
   - Use `useCashFlowFormScreen` for complete form functionality
   - Easier to maintain and test

2. **Use Individual Hooks for Specific Tasks**
   - Use `useCashFlowData` in a list screen
   - Use `useCashFlowValidation` in a separate validation hook
   - Use `useCashFlowCodeSuggestion` in an autocomplete component

3. **Always Handle Loading States**
   - Check `isLoading` before rendering data
   - Show loading indicator to user

4. **Validate Form Data**
   - Always use `validateCode` in React Hook Form rules
   - Provide user-friendly error messages

5. **Manage Dependencies**
   - Ensure context providers are available
   - Mock them in tests

6. **Handle Navigation Properly**
   - Pass navigation object to `useCashFlowSubmit`
   - Ensure navigation is available in component context

## Limitations & Known Issues

1. **Database Required:** All hooks require a working database context
2. **Navigation Required:** `useCashFlowSubmit` requires navigation context
3. **No Offline Support:** Requires active database connection
4. **No Caching:** Data is fetched fresh each time (by design)

## Future Enhancements

1. Add data caching with SWR or React Query
2. Add offline support with sync queue
3. Create index file for centralized exports
4. Add TypeScript stricter null checks
5. Create error boundary for hook failures
6. Add comprehensive error logging

## Additional Resources

- [Hook Architecture Diagram](./HOOK_ARCHITECTURE.md)
- [Refactoring Summary](./REFACTORING_SUMMARY.md)
- [React Hooks Documentation](https://react.dev/reference/react)
- [React Hook Form Guide](https://react-hook-form.com/)
