/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  moduleNameMapper: {
    '@services/(.*)': '<rootDir>/../shared/services/$1',
    '@data/(.*)': '<rootDir>/../shared/data/$1',
    '@functions/(.*)': '<rootDir>/../shared/functions/$1',
    '@schema/(.*)': '<rootDir>/../shared/schema/$1',
  }
};