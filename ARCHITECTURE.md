# 🏗️ 406 Condo Bills - Architecture

## Project Overview

A React Native application for managing condominium finances using **Feature-Based Architecture** with **Single Responsibility Principle** applied throughout.

```
app/
├── features/                 # Feature modules (cash-flow focused)
│   └── cash-flow/           # Feature: Cash Flow Management
│       ├── screens/         # UI Screens
│       │   ├── CashFlowFormScreen.tsx    # Form for create/edit
│       │   └── CashFlowListScreen.tsx    # List display
│       ├── hooks/           # Custom hooks with single responsibility
│       │   ├── useCashFlowFormScreen.ts      # Form orchestrator
│       │   ├── useCashFlowForm.ts            # Form state management
│       │   ├── useCashFlowData.ts            # Data fetching
│       │   ├── useCashFlowValidation.ts      # Code validation
│       │   ├── useCashFlowCodeSuggestion.ts  # Code generation
│       │   ├── useCashFlowSubmit.ts          # Form submission
│       │   ├── useCashFlowListScreen.ts      # List orchestrator
│       │   ├── useCashFlowListSearch.ts      # Search/filtering
│       │   ├── useCashFlowListDelete.ts      # Delete operations
│       │   └── useCashFlowListNavigation.ts  # Navigation
│       ├── utils/           # Utility functions
│       │   └── getCodeColor.ts              # Code color determination
│       ├── api.ts           # CashFlowRepository
│       ├── types.ts         # TypeScript types
│       ├── constants.ts     # Feature constants
│       └── __tests__/       # Test files
├── shared/                  # Shared code across features
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx, Input.tsx, Header.tsx
│   │   ├── Select.tsx, Load.tsx, etc.
│   │   └── __tests__/
│   ├── context/            # Context API providers
│   │   ├── DatabaseContext.tsx
│   │   ├── AlertContext.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── __tests__/
│   ├── types/              # Shared types
│   │   └── DatabaseContext.ts
│   └── __tests__/          # Shared component tests
├── infrastructure/          # Data & System layer
│   ├── database/           # SQLite database
│   │   ├── db.ts
│   │   ├── index.ts
│   │   ├── migrations.ts
│   │   ├── migrationManager.ts
│   │   └── __tests__/
│   └── i18n/               # Internationalization
│       ├── i18n.config.ts
│       └── locales/
├── routes/                  # Navigation configuration
│   ├── index.tsx
│   └── types.ts
├── styles/                  # Global theme
│   ├── colors.ts, fonts.ts, sizes.ts
│   ├── borderRadius.ts, spaces.ts
│   └── index.ts
└── assets/                  # Images, icons
```

## Core Principles

### 1. Feature-Based Architecture

- Each feature is a self-contained module
- Code related to a feature lives together
- Minimal dependencies between features
- Easy to scale and maintain

### 2. Single Responsibility Principle

Applied at multiple levels:

**Hook Level:**

- Each hook has one job (search, delete, navigation, etc.)
- Smaller, focused hooks are easier to test and reuse
- Example: `useCashFlowListSearch` only handles search logic

**Function Level:**

- Pure utility functions (e.g., `getCodeColor`)
- Repository methods have single domain purpose
- Type definitions are specific to context

**Component Level:**

- Screens focus only on rendering
- UI logic moved to custom hooks
- Components receive data via props or hooks

### 3. Composition Over Inheritance

- Specialized hooks composed into main orchestrator hooks
- Orchestrator hooks provide complete interface to screens
- Clear dependency flow: Utilities → Hooks → Component

### 4. Type Safety

- TypeScript strict mode
- Well-defined interfaces for each feature
- Proper typing for context providers

## Hook Architecture Pattern

### Orchestrator Hook (Main Hook)

Composes specialized hooks and provides complete interface to screens.

```typescript
// useCashFlowListScreen.ts (98 lines)
export const useCashFlowListScreen = () => {
  // Compose specialized hooks
  const search = useCashFlowListSearch(items);
  const deleteOps = useCashFlowListDelete(onDeleteSuccess);
  const navigation = useCashFlowListNavigation();

  // Manage data loading
  const { items, isLoading, error } = useDataLoading();

  // Return composed interface
  return {
    ...search,
    ...deleteOps,
    ...navigation,
    items,
    isLoading,
    error,
  };
};
```

### Specialized Hooks (Single Responsibility)

Each hook handles one specific concern.

**Search Hook (useCashFlowListSearch)**

- Responsibility: Filter items based on search query
- State: searchQuery, filtered items
- Performance: Uses useMemo to prevent unnecessary recalculations
- Size: ~30 lines

**Delete Hook (useCashFlowListDelete)**

- Responsibility: Handle deletion with confirmation modal
- Features: Recursive deletion of children, error handling
- Pattern: Callback for parent to update state
- Size: ~71 lines

**Navigation Hook (useCashFlowListNavigation)**

- Responsibility: Handle all screen navigation
- Methods: Form navigation, card press handlers
- Dependency: React Navigation
- Size: ~20 lines

### Utility Functions

Pure functions with no state dependency.

**getCodeColor**

- Input: code type
- Output: color string
- Reusability: Used in multiple components
- Testing: Simple, deterministic function

## Data Flow Architecture

### Form Screen Flow

```
CashFlowFormScreen (Component)
         ↓
useCashFlowFormScreen (Orchestrator)
  ├→ useCashFlowForm (State management)
  ├→ useCashFlowData (Data fetching)
  ├→ useCashFlowValidation (Code validation)
  ├→ useCashFlowCodeSuggestion (Code generation)
  └→ useCashFlowSubmit (Form submission)
         ↓
CashFlowRepository (Database access)
         ↓
SQLite Database
```

### List Screen Flow

```
CashFlowListScreen (Component)
         ↓
useCashFlowListScreen (Orchestrator)
  ├→ useCashFlowListSearch (Search/Filter)
  ├→ useCashFlowListDelete (Delete operations)
  └→ useCashFlowListNavigation (Navigation)
         ↓
CashFlowRepository (Database access)
         ↓
SQLite Database
```

## Context Providers

### DatabaseContext

- Provides SQLite database instance
- Manages database initialization
- Available globally to all features

### AlertContext

- Provides alert notifications
- Used for user feedback
- Centralized notification management

### ErrorBoundary

- Catches React errors
- Displays fallback UI
- Prevents app crashes

## Testing Strategy

### Unit Tests

- Individual hooks tested in isolation
- Mock repository and context
- Focus on hook logic

### Component Tests

- Screen components tested with mocked hooks
- Verify rendering and user interactions
- Test integration with hooks

### Integration Tests

- Test hook composition
- Verify data flows correctly
- Test complete feature workflows

## Best Practices

## Best Practices

### ✅ Imports & Path Aliases

```typescript
// ❌ Avoid relative imports
import { Button } from '../../../shared/components';

// ✅ Use path aliases
import { Button } from '@/shared/components';
import { CashFlowRepository } from '@/features/cash-flow/api';
```

### ✅ Hook Composition

```typescript
// ❌ Monolithic hook
export const useLargeFeature = () => {
  // 200+ lines of mixed concerns
  return { search, delete, navigate, data, ... }
}

// ✅ Composed hooks
export const useLargeFeature = () => {
  const search = useSearch(items)
  const deleteOps = useDelete(onSuccess)
  const navigation = useNavigation()
  return { ...search, ...deleteOps, ...navigation }
}
```

### ✅ Performance Optimization

```typescript
// Use useMemo for expensive calculations
const filteredItems = useMemo(
  () => items.filter(item => item.code.includes(searchQuery)),
  [items, searchQuery],
);

// Use useCallback for callback dependencies
const handleDelete = useCallback(
  async id => {
    await repository.delete(id);
  },
  [repository],
);
```

### ✅ Type Safety

```typescript
// Define feature types
export interface CashFlowItem {
  id: number;
  code: string;
  type: FlowType;
}

// Use proper typing in hooks
export const useMyHook = (): MyHookReturn => {
  // implementation
};
```

### ✅ Error Handling

```typescript
// In hooks, provide error state and messages
const [error, setError] = useState<Error | null>(null);

// In components, use AlertContext for user feedback
const { showAlert } = useAlert();
if (error) showAlert(error.message);
```

## Scaling Guidelines

### Adding a New Feature

1. Create `app/features/new-feature/` directory
2. Create subdirectories: screens, hooks, utils
3. Create `types.ts` for feature types
4. Create `api.ts` for repository if needed
5. Create `constants.ts` for feature constants
6. Add tests in `__tests__/` directory

### Refactoring Large Hooks

1. Identify separate concerns (search, delete, navigate, data)
2. Create specialized hooks for each concern
3. Create orchestrator hook to compose them
4. Update component imports
5. Add/update tests for new hooks

### Adding Shared Components

1. Create in `app/shared/components/`
2. Make component reusable (props for customization)
3. Add tests
4. Export from `app/shared/components/index.ts`
5. Document usage patterns

## Current Refactoring Progress

✅ **Phase 1**: Repository abstraction in form hook

- Created: useCashFlowData, useCashFlowValidation, useCashFlowCodeSuggestion, useCashFlowSubmit
- Impact: Form logic organized into 4 focused hooks

✅ **Phase 2**: Constant centralization

- Moved CODE_PATTERN from individual hooks to constants.ts
- Benefits: Single source of truth for patterns

✅ **Phase 3**: List screen logic extraction

- Moved UI logic from component to hook
- Created: useCashFlowListScreen
- Benefits: Cleaner component, reusable logic

✅ **Phase 4**: List screen hook separation

1. Identify separate concerns (search, delete, navigate, data)
2. Create specialized hooks for each concern
3. Create orchestrator hook to compose them
4. Update component imports
5. Add/update tests for new hooks

### Adding Shared Components

1. Create in `app/shared/components/`
2. Make component reusable (props for customization)
3. Add tests
4. Export from `app/shared/components/index.ts`
5. Document usage patterns

## Current Refactoring Progress

✅ **Phase 1**: Repository abstraction in form hook

- Created: useCashFlowData, useCashFlowValidation, useCashFlowCodeSuggestion, useCashFlowSubmit
- Impact: Form logic organized into 4 focused hooks

✅ **Phase 2**: Constant centralization

- Moved CODE_PATTERN from individual hooks to constants.ts
- Benefits: Single source of truth for patterns

✅ **Phase 3**: List screen logic extraction

- Moved UI logic from component to hook
- Created: useCashFlowListScreen
- Benefits: Cleaner component, reusable logic

✅ **Phase 4**: List screen hook separation

- Created: useCashFlowListSearch, useCashFlowListDelete, useCashFlowListNavigation
- Extracted: getCodeColor utility function
- Impact: Main hook reduced from 171 to 98 lines (43% reduction)

## Metrics

- **Total Tests**: 49 (all passing)
- **Test Coverage**: 52.32%
- **Hook Composition Levels**: Up to 2 (orchestrator + specialized)
- **Code Reusability**: High (shared hooks, components, utilities)
- **Maintainability**: Improved (small, focused files)
