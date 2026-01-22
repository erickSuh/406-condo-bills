/* eslint-disable no-undef */
// jest.setup.js

// Set up __DEV__ global for modules that check it at import time
global.__DEV__ = false;

// Mock font loading first - needed before components render
jest.mock('@expo-google-fonts/roboto', () => ({
  useFonts: () => [true],
}));

jest.mock('@expo-google-fonts/rubik', () => ({
  useFonts: () => [true],
}));

// Mock only external dependencies that don't work in test environment
// DO NOT mock react-native - use native testing with react-test-renderer

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock expo-sqlite - use the actual expo-sqlite-mock module
jest.mock('expo-sqlite', () => {
  try {
    // Try to get the actual expo-sqlite-mock module
    return require('expo-sqlite-mock');
  } catch (e) {
    // Fallback mock if package not found
    return {
      openDatabaseAsync: jest.fn().mockResolvedValue({
        execAsync: jest.fn(),
        runAsync: jest.fn(),
        getAllAsync: jest.fn().mockResolvedValue([]),
        getFirstAsync: jest.fn(),
        closeAsync: jest.fn(),
        transactionAsync: jest.fn(),
      }),
    };
  }
});

// Mock react-navigation to prevent initialization issues
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    NavigationContainer: ({ children }) => children,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useFocusEffect: callback => callback(),
    useIsFocused: jest.fn(() => true),
  };
});

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: jest.fn(() => ({
    Navigator: ({ children }) => <>{children}</>,
    Screen: ({ children }) => <>{children}</>,
  })),
}));

// Mock i18n initialization
jest.mock('./app/infrastructure/i18n', () => ({}));

// Mock Sentry for testing
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  wrap: component => component,
  setUser: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  addBreadcrumb: jest.fn(),
  startTransaction: jest.fn(),
  mobileReplayIntegration: jest.fn(() => ({})),
  feedbackIntegration: jest.fn(() => ({})),
  ReactNativeTracing: jest.fn(() => ({})),
}));

// Mock react-i18next for translations - CRITICAL for text rendering
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => options?.defaultValue || key,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'pt-BR',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

// import 'react-native-gesture-handler/jestSetup';
// import { setUpTests } from 'react-native-reanimated';
// setUpTests();

import { jest } from '@jest/globals';

// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Include this section for mocking react-native-screens
jest.mock('react-native-screens', () => {
  // Require actual module instead of a mock
  let screens = jest.requireActual('react-native-screens');

  // All exports in react-native-screens are getters
  // We cannot use spread for cloning as it will call the getters
  // So we need to clone it with Object.create
  screens = Object.create(
    Object.getPrototypeOf(screens),
    Object.getOwnPropertyDescriptors(screens),
  );

  // Add mock of the component you need
  // Here is the example of mocking the Screen component as a View
  Object.defineProperty(screens, 'Screen', {
    value: require('react-native').View,
  });

  return screens;
});
