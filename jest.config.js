module.exports = {
  projects: [
    {
      displayName: 'react-native',
      preset: 'react-native',
      testEnvironment: 'node',
      testMatch: [
        '**/__tests__/**/*Screen.test.ts?(x)',
        '**/?(*.)Screen.(spec|test).ts?(x)',
      ],
      transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            tsconfig: {
              noUnusedLocals: false,
              noUnusedParameters: false,
              jsx: 'react-jsx',
            },
          },
        ],
        '^.+\\.(js|jsx)$': 'babel-jest',
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/app/$1',
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      transformIgnorePatterns: [
        'node_modules/(?!(expo-sqlite-mock|expo|expo-font|expo-splash-screen|expo-sqlite|@expo|@react-native|react-native|react-native-screens|react-native-safe-area-context|@react-navigation)/)',
      ],
    },
    {
      displayName: 'hooks',
      preset: 'react-native',
      testEnvironment: 'jsdom',
      testMatch: [
        '**/__tests__/**/*.test.ts?(x)',
        '!**/__tests__/**/*Screen.test.ts?(x)',
        '!**/__tests__/**/?(*.)Screen.(spec|test).ts?(x)',
      ],
      transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            tsconfig: {
              noUnusedLocals: false,
              noUnusedParameters: false,
              jsx: 'react-jsx',
            },
          },
        ],
        '^.+\\.(js|jsx)$': 'babel-jest',
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/app/$1',
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      transformIgnorePatterns: [
        'node_modules/(?!(expo-sqlite-mock|expo|expo-font|expo-splash-screen|expo-sqlite|@expo|@react-native|react-native|react-native-screens|react-native-safe-area-context|@react-navigation)/)',
      ],
    },
  ],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/index.ts',
    '!app/**/*.test.ts',
    '!app/**/*.test.tsx',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.expo/'],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },
};
