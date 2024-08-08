module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/config/jest.setup.js'],
  moduleNameMapper: {
    '^sequelize$': '<rootDir>/config/config.test.js',
  },
};