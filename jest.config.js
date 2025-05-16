// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', 'test_seed.js'],
  setupFilesAfterEnv: ['./jest.setup.js'],
};
