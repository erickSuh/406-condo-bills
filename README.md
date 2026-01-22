# 406-condo-bills

A modern React Native application for managing financial flows and accounting codes in a condominium building using Expo and SQLite.

## 📱 Features

- ✅ **Cash Flow Management** - Create and manage hierarchical accounting codes
- ✅ **SQLite Database** - Local data persistence with migration system
- ✅ **Multi-language Support** - Portuguese language support with i18n
- ✅ **OTA Updates** - Over-the-air updates using Expo Updates
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

### Building & Deployment

```bash
# Preview build (internal distribution)
eas update --channel preview

# Production build
eas build --platform ios
eas build --platform android
```

## 📚 Project Highlights

### Database

- SQLite with Expo SQLite
- Automatic migration system on app launch
- Schema versioning and rollback support

### Error Tracking & Analytics (Sentry)

- **Automatic Error Capture**: ErrorBoundary catches all React errors
- **Performance Monitoring**: Track slow transactions and performance issues
- **Session Replay**: Replay sessions with errors for debugging
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
mponents, and screens

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
- **TypeScript** - Type safety
- **SQLite** - Local database
- **React Navigation** - Navigation
- **i18next** - Internationalization
- **React Hook Form** - Form management
- **Jest** - Testing framework

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
