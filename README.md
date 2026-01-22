# 406-condo-bills

A modern React Native application for managing financial flows and accounting codes in a condominium building using Expo and SQLite.

## 📱 Features

- ✅ **Cash Flow Management** - Create and manage hierarchical accounting codes
- ✅ **SQLite Database** - Local data persistence with migration system
- ✅ **Multi-language Support** - Portuguese language support with i18n
- ✅ **OTA Updates** - Over-the-air updates using Expo Updates (see [OTA_updates.md](OTA_updates.md))
- ✅ **Error Tracking** - Sentry integration for error monitoring and analytics
- ✅ **Custom UI Components** - Design system with consistent styling
- ✅ **Comprehensive Validation** - Code format, depth, and uniqueness validation
- ✅ **Error Handling** - Custom error boundaries and alert dialogs
- ✅ **Type-Safe** - Full TypeScript support

## 🏗️ Architecture

This project follows a **Feature-Based Architecture** with:

- **Features**: Isolated business logic modules (e.g., `features/cash-flow`)
- **Shared**: Reusable components, contexts, and utilities
- **Infrastructure**: Database, i18n, and other system-level services
- **Styles**: Centralized design system (colors, fonts, spacing, borders)

For detailed architectural decisions and design patterns, see [ARCHITECTURE.md](ARCHITECTURE.md).

```
app/
├── features/
│   └── cash-flow/          # Main business feature
│       ├── screens/        # React components (screens)
│       ├── hooks/          # Custom hooks (9 specialized hooks)
│       ├── utils/          # Utility functions
│       ├── api.ts          # Repository pattern for data access
│       ├── types.ts        # TypeScript interfaces
│       ├── constants.ts    # Feature constants
│       └── __tests__/      # Unit tests
├── shared/
│   ├── components/         # Reusable UI components
│   ├── context/            # React contexts (Alert, Database, ErrorBoundary)
│   └── types/              # Shared types
├── infrastructure/
│   ├── database/           # SQLite with migrations
│   └── i18n/               # Internationalization
└── styles/                 # Design system tokens
```

### State Management Strategy

**Why Hooks over Redux or Context API for Business Logic?**

- **Hooks (Feature-Level)**: Isolated, reusable business logic
  - `useCashFlowData()` - Data fetching & caching
  - `useCashFlowValidation()` - Business rule validation
  - `useCashFlowSubmit()` - Form submission
  - Benefits: Composition, testability, lightweight, no boilerplate

- **Context API (Global State)**: Truly global data needed across the app
  - `DatabaseContext` - Single database connection
  - `AlertContext` - Global alert system
  - `ErrorBoundary` - Global error handling

**Design Philosophy:**

- Hooks manage feature-specific concerns locally
- Context handles app-level infrastructure
- No Redux needed for single-feature apps with simple state
- Improves: Developer velocity, testing, bundle size, learning curve

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- yarn or npm
- Expo CLI (optional, for EAS builds)

### Installation

```bash
# Install dependencies
yarn install
# or
npm install

# Setup environment variables
cp .env.example .env.local
# Then edit .env.local and add your Sentry DSN from https://sentry.io/

# Start development server
yarn start
# or
npm start
```

### Environment Variables

Create `.env.local` file with:

```env
# Sentry Configuration (get DSN from https://sentry.io/)
EXPO_PUBLIC_SENTRY_DSN=https://your-key@your-org.ingest.sentry.io/project-id

# App Version (optional)
EXPO_PUBLIC_APP_VERSION=1.0.0
```

See `.env.example` for all available options.

### Running Tests

```bash
# Run all tests
yarn test

# Run specific test pattern
yarn test --testPathPattern="cash-flow"

# Run with coverage
yarn test --coverage
```

### Testing (Jest)

**Why Jest over Mocha, Vitest, or native test runners?**

- **Zero Config**: Works out-of-the-box with Expo and React Native
- **Snapshot Testing**: Perfect for component regression detection
- **Coverage Reports**: Built-in coverage analysis and reporting
- **Mocking & Spying**: Powerful mocking capabilities for unit tests
- **Performance**: Parallel test execution with watch mode
- **Developer Experience**: Clear error messages and assertion library

```typescript
// Example: Testing a validation hook
describe('useCashFlowValidation', () => {
  it('should validate code format', async () => {
    const { result } = renderHook(() => useCashFlowValidation());

    const isValid = await result.current.validateCode('1.2.3');
    expect(isValid).toBe(true);
  });

  it('should reject invalid codes', async () => {
    const { result } = renderHook(() => useCashFlowValidation());

    const error = await result.current.validateCode('invalid');
    expect(error).toBeDefined();
  });
});
```

**Coverage:**

- **150+ tests** passing consistently
- Unit tests for hooks, components, and screens
- Integration tests for database operations
- Component snapshot tests for regression detection

### Building & Deployment

```bash
# Preview build (internal distribution)
eas update --channel preview

# Production build
eas build --platform ios
eas build --platform android
```

### Commit Linting (commitlint)

**Why commitlint for conventional commits?**

- **Enforces Consistency**: All commits follow Conventional Commits standard
- **Automated Changelog**: Enables automatic version bumping and changelog generation
- **Better History**: Clear, searchable commit messages (`feat:`, `fix:`, `docs:`, etc.)
- **CI/CD Integration**: Prevents bad commits from reaching main branch
- **Team Standards**: Enforces commit standards across all developers
- **Pre-commit Validation**: Hooks reject invalid commits immediately

```bash
# Commit message format (enforced by commitlint)
git commit -m "feat: add new cache system"      # New feature
git commit -m "fix: resolve memory leak"        # Bug fix
git commit -m "docs: update README"             # Documentation
git commit -m "refactor: simplify validation"   # Code refactoring
git commit -m "test: add hook tests"            # Tests
git commit -m "chore: update dependencies"      # Build/tooling
```

**Configuration** (`commitlint.config.js`):

- Uses Conventional Commits preset
- Enforced on all commits via Git hooks
- Prevents merges with non-compliant messages
- Enables automated version management

## 📚 Project Highlights

### Database

- SQLite with Expo SQLite
- Automatic migration system on app launch
- Schema versioning and rollback support

### Error Tracking & Analytics (Sentry)

- **Automatic Error Capture**: ErrorBoundary catches all React errors
- **Performance Monitoring**: Track slow transactions and performance issues
- **User Context**: Track which user experienced errors
- **Custom Events**: Use `useSentry` hook to track custom events

```typescript
// Using Sentry in components
const { trackEvent, reportError } = useSentry();

// Track user action
trackEvent('Form submitted', 'form', 'info', { formId: 'cash-flow-form' });

// Report error manually
reportError(error, { context: 'payment-processing' });
```

### Validation

- **CODE_PATTERN_MAX_DEPTH_6**: Validates hierarchical codes with max 6 levels
- Format: `1`, `1.2`, `1.2.3`, etc. (each segment 1-999)
- Automatic depth validation based on parent codes

### Hooks Architecture

Custom hooks for separation of concerns:

1. `useCashFlowData` - Data fetching and caching
2. `useCashFlowValidation` - Code validation logic
3. `useCashFlowCodeSuggestion` - Smart code suggestions
4. `useCashFlowSubmit` - Form submission handling
5. `useCashFlowListDelete` - Deletion with cascade
6. `useCashFlowFormScreen` - Form orchestration
7. `useCashFlowListScreen` - List screen logic
8. `useCashFlowListSearch` - Search functionality
9. `useCashFlowListNavigation` - Navigation state

### Form Management (React Hook Form)

**Why React Hook Form over Formik or manual state?**

- **Performance**: Minimizes re-renders with uncontrolled components
- **Bundle Size**: ~8.5KB vs Formik's ~15KB
- **Developer Experience**: Simple API with less boilerplate
- **Validation**: Built-in async validation and custom rules
- **React Native Compatible**: Works seamlessly with Expo

```typescript
// Usage in CashFlowFormScreen
const { control, handleSubmit, formState: { errors }, watch } = useForm<CashFlowFormData>({
  defaultValues: { code: '', title: '', type: '0', acceptsEntries: 0 },
});

// Integrate with custom validation hooks
const { validateCode, validateTitle } = useCashFlowValidation();

// Controller wraps native inputs for form integration
<Controller
  control={control}
  name="code"
  rules={{ validate: validateCode }}
  render={({ field: { value, onChange } }) => (
    <Input value={value} onChangeText={onChange} />
  )}
/>
```

**Benefits:**

- Decoupled validation logic (hooks)
- Efficient re-renders
- TypeScript support with strong typing
- Easy integration with custom validation

### i18n (Internationalization)

- Portuguese (pt-BR) support
- Namespaced translation files
- Interpolation support for dynamic values

## 📊 Test Coverage

- **150+ tests** passing
- Unit tests for hooks, components, and screens
- Integration tests for database and API
- Component snapshot tests

## 🎨 Design System

Centralized design tokens:

- **Colors**: Primary, secondary, success, error, warning, info
- **Typography**: Roboto and Rubik fonts
- **Spacing**: Consistent 4-unit scale
- **Border Radius**: Small, medium, large, full
- **Sizes**: Fine-tuned spacing values

## 🔧 Technology Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and managed service
- **TypeScript** - Type safety and code documentation
- **SQLite** - Local persistent database
- **React Navigation** - Screen and navigation management
- **i18next** - Multi-language support
- **React Hook Form** - Efficient form state management
- **Jest** - Testing framework with snapshots and coverage
- **commitlint** - Enforces Conventional Commits convention
- **Sentry** - Error tracking and performance monitoring

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
