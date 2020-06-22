
/* eslint-disable max-len */
/* eslint-disable quotes */
// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  bail: false,

  clearMocks: true,

  testMatch: [
    "**/__tests__/(unit|integration)/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ]
};
