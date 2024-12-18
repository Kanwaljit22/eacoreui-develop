const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
        "preset": "jest-preset-angular",
        "setupFilesAfterEnv": [
          "<rootDir>/setup-jest.ts"
        ],
        "globalSetup": 'jest-preset-angular/global-setup',
        "testPathIgnorePatterns": [
          "<rootDir>/node_modules/",
          "<rootDir>/dist/"
        ],
        "testMatch": [ "**/?(*.)+(spec|test).[jt]s?(x)" ],
        "roots": [
          "<rootDir>",
          "src/app/",
          "src/vnext/"
        ],
        "testTimeout": 20000,
        "modulePaths": [
          "<rootDir>",
          "/src",
          "src/app/",
          "src/vnext/"
        ],
        "moduleDirectories": [
          "node_modules",
          "src"
        ],
        "moduleNameMapper": pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src/' } ),
        "globals": {
          "ts-jest": {
            "tsconfig": "<rootDir>/tsconfig.spec.json",
            "stringifyContentPathRegex": "\\.html$"
          }
        }
}