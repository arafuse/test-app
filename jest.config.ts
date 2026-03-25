/**
 * @jest-config-loader-options {"compilerOptions":{"module":"CommonJS","moduleResolution":"node","verbatimModuleSyntax":false}}
 */

import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          module: 'CommonJS',
          moduleResolution: 'node',
          esModuleInterop: true,
          verbatimModuleSyntax: false,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/app/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

export default config
