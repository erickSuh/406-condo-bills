# Cash Flow Form Architecture - Hook Composition Pattern

## Detailed Hook Composition Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CashFlowFormScreen (UI Layer)                       │
│  - Renders form fields                                                       │
│  - Handles user interactions                                                 │
│  - Conditionally renders read-only view                                     │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             │ uses hook
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              useCashFlowFormScreen (Orchestrator Hook)                       │
│  - Composes all specialized hooks                                           │
│  - Manages form control (React Hook Form)                                   │
│  - Handles route parameters                                                 │
│  - Coordinates hook logic                                                   │
│                                                                               │
│  Returns:                                                                    │
│  - control: Form control object                                             │
│  - errors: Form validation errors                                           │
│  - handleSubmit: Form submit handler                                        │
│  - parentItems, flowTypes: Formatted select options                         │
│  - validateCode: Form field validator                                       │
│  - suggestedPrefix: Dynamic code prefix                                     │
│  - isTypeDisabled, isReadOnly, itemToView                                   │
└────┬────────────┬──────────────────┬──────────────────┬──────────────────┘
     │            │                  │                  │
     │            │                  │                  │
     ▼            ▼                  ▼                  ▼
┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────────┐
│Data Hook │  │Validation│  │Code          │  │Submission    │
│          │  │Hook      │  │Suggestion    │  │Hook          │
└──────────┘  └──────────┘  │Hook          │  └──────────────┘
     │            │          └──────────────┘        │
     │            │                 │                │
     ▼            ▼                 ▼                ▼
┌─────────────────────────────────────────────────────────┐
│              CashFlowRepository                          │
│  - getCashFlowAbleToBeParent()                          │
│  - getFlowTypes()                                       │
│  - getCashFlowChildren()                                │
│  - getCashFlowByCode()                                  │
│  - insertCashFlow()                                     │
└─────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│              SQLite Database                             │
│  - cash_flow table                                       │
│  - flow_types table                                      │
└─────────────────────────────────────────────────────────┘
```

## Hook Dependencies

### useCashFlowData

```
useCashFlowData
├─ useDatabase (context)
├─ useEffect (react)
├─ useState (react)
├─ useCallback (react)
└─ CashFlowRepository
   ├─ getCashFlowAbleToBeParent()
   └─ getFlowTypes()
```

### useCashFlowValidation

```
useCashFlowValidation
├─ useCallback (react)
├─ useDatabase (context)
├─ CashFlowRepository
│  └─ getCashFlowByCode()
└─ RegExp validation
```

### useCashFlowCodeSuggestion

```
useCashFlowCodeSuggestion
├─ useCallback (react)
├─ useDatabase (context)
├─ CashFlowRepository
│  └─ getCashFlowChildren()
└─ suggestNextCode utility
   └─ Hierarchical escalation logic
```

### useCashFlowSubmit

```
useCashFlowSubmit
├─ useCallback (react)
├─ useNavigation (react-navigation)
├─ useDatabase (context)
├─ useAlert (context)
└─ CashFlowRepository
   └─ insertCashFlow()
```

### useCashFlowFormScreen (Orchestrator)

```
useCashFlowFormScreen
├─ useForm (react-hook-form)
├─ useState (react)
├─ useCallback (react)
├─ useEffect (react)
├─ useMemo (react)
├─ useRoute (react-navigation)
├─ useNavigation (react-navigation)
├─ useDatabase (context)
├─ useTranslation (i18n)
├─ useCashFlowData
├─ useCashFlowValidation
├─ useCashFlowCodeSuggestion
└─ useCashFlowSubmit
```

## Data Flow

### Form Initialization

```
1. Component mounts
   └─> useCashFlowFormScreen() called
       ├─> useCashFlowData()
       │   └─> Load parentItems & flowTypes
       ├─> React Hook Form initialized
       └─> route params checked for read-only mode
```

### Parent Selection Changed

```
2. User selects parent
   └─> parentAccountIdValue watch detects change
       └─> useCashFlowCodeSuggestion
           ├─> suggestCode() called
           ├─> Fetch all children codes
           ├─> Calculate next code with escalation
           ├─> Update form code field
           ├─> Update prefix state
           └─> Set parent's type field
```

### Code Validation

```
3. User enters/changes code
   └─> validateCode callback triggered
       ├─> Check format: /^\d{1,3}(\.\d{1,3})*$/
       ├─> Check segments: ≤ 999 each
       ├─> Check depth: matches parent + 1
       ├─> useCashFlowValidation
       │   └─> Query repository for duplicate
       └─> Return error or true (valid)
```

### Form Submission

```
4. User submits form
   └─> onSubmit callback triggered
       └─> useCashFlowSubmit.submitCashFlow()
           ├─> Validate data format
           ├─> Insert via CashFlowRepository
           ├─> Show success alert
           ├─> Refresh items list
           └─> Navigate back
```

## Error Handling

### Validation Errors

- **Code format:** "O código deve estar no formato válido (ex: 1, 123, 1.2, 1.23.456)"
- **Segment size:** "Each segment must be less than 1000"
- **Code depth:** "O código deve ter exatamente X segmentos (ex: "Y.1")"
- **Code exists:** "Já existe uma conta com este código"
- **Parent missing:** "Parent code does not exist"

### Submission Errors

- Database not available
- Database query failures
- Generic error fallback with error message display

## Performance Considerations

1. **useMemo:** Formatting options recalculated only when source data changes
2. **useCallback:** Validation and submission functions maintain referential equality
3. **useEffect:** Data fetching only on isReady change
4. **Dependency Arrays:** Carefully managed to prevent unnecessary re-renders

## Testing Strategy

Each hook is independently testable:

- Unit tests for individual hooks
- Mock CashFlowRepository for isolation
- Mock context providers (Database, Alert)
- Integration tests for hook composition

## File Structure

```
app/features/cash-flow/
├── hooks/
│   ├── useCashFlowFormScreen.ts      (Main hook - 237 lines)
│   ├── useCashFlowData.ts             (Data management - new)
│   ├── useCashFlowValidation.ts       (Validation - new)
│   ├── useCashFlowCodeSuggestion.ts   (Code suggestion - new)
│   ├── useCashFlowSubmit.ts           (Submission - new)
│   └── useCashFlowListScreen.ts       (Existing list hook)
├── screens/
│   ├── CashFlowFormScreen.tsx         (No changes)
│   └── CashFlowListScreen.tsx
├── api.ts                              (Repository - added getCashFlowByCode)
├── types.ts                            (Added CreateCashFlowInput)
├── utils/
│   └── suggestNextCode.ts             (Existing utility)
└── constants.ts
```

## Migration Checklist

- ✅ Create useCashFlowData hook
- ✅ Create useCashFlowValidation hook
- ✅ Create useCashFlowCodeSuggestion hook
- ✅ Create useCashFlowSubmit hook
- ✅ Refactor useCashFlowFormScreen to compose hooks
- ✅ Add getCashFlowByCode to repository
- ✅ Add CreateCashFlowInput type
- ✅ Fix TypeScript errors
- ✅ Update imports
- ✅ Run all tests (17 suites, 150 tests ✓)
- ✅ Document changes
