module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: {
        noUnusedLocals: false,
        noUnusedParameters: false,
        jsx: 'react-jsx',
      },
    },
  },
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/index.ts',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.expo/'],
  transformIgnorePatterns: [
    'node_modules/(?!(expo|expo-font|expo-splash-screen|expo-sqlite|@expo|@react-native|react-native|react-native-screens|react-native-safe-area-context|@react-navigation)/)',
  ],
  // coverageThreshold: {
  //   global: {
  //     branches: 50,
  //     functions: 50,
  //     lines: 50,
  //     statements: 50,
  //   },
  // },
};
