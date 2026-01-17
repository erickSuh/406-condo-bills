// jest.setup.js
const React = require('react');

// Mock React Native
jest.mock('react-native', () => {
  return {
    View: React.forwardRef((props, ref) =>
      React.createElement('div', { ref, ...props }),
    ),
    Text: React.forwardRef((props, ref) =>
      React.createElement('span', { ref, ...props }),
    ),
    StyleSheet: {
      create: styles => styles,
    },
    TextInput: React.forwardRef((props, ref) =>
      React.createElement('input', { ref, ...props }),
    ),
    TouchableOpacity: React.forwardRef((props, ref) =>
      React.createElement('div', { ref, ...props }),
    ),
  };
});

// Mock Expo modules
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));
