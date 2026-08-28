module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.test.js'],
  coverageThreshold: {
    global: { lines: 90, statements: 90, functions: 90, branches: 85 },
  },
  testMatch: ['**/*.test.js', '!**/e2e/**'],
};