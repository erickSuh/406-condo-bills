/* eslint-disable no-undef */
// jest.setup.js
const React = require('react');

// Mock React Native
jest.mock('react-native', () => {
  return {
    View: React.forwardRef(function View(props, ref) {
      const View = viewProps => React.createElement('div', viewProps);
      View.displayName = 'MockView';
      return React.createElement(View, { ...props, ref });
    }),
    Text: React.forwardRef(function Text(props, ref) {
      const Text = textProps => React.createElement('span', textProps);
      Text.displayName = 'MockText';
      return React.createElement(Text, { ...props, ref });
    }),
    StyleSheet: {
      create: styles => styles,
    },
    TextInput: React.forwardRef(function TextInput(props, ref) {
      const TextInput = inputProps => React.createElement('input', inputProps);
      TextInput.displayName = 'MockTextInput';
      return React.createElement(TextInput, { ...props, ref });
    }),
    TouchableOpacity: React.forwardRef(function TouchableOpacity(props, ref) {
      const TouchableOpacity = touchProps =>
        React.createElement('div', touchProps);
      TouchableOpacity.displayName = 'MockTouchableOpacity';
      return React.createElement(TouchableOpacity, { ...props, ref });
    }),
  };
});

// Mock Expo modules
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));
