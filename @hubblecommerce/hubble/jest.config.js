module.exports = {
    rootDir: "../../../../",
    // tell Jest to handle `*.vue` files
    moduleFileExtensions: ["js", "json", "vue"],
    watchman: false,
    moduleNameMapper: {
      "^~/(.*)$": "<rootDir>/$1",
      "^~~/(.*)$": "<rootDir>/$1",
      "^@/(.*)$": "<rootDir>/$1"
    },
    setupFiles: [
      'dotenv/config',
    ],
    setupFilesAfterEnv:[
      "jest-expect-message"
    ],
    transform: {
      // process js with `babel-jest`
      "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
      // process `*.vue` files with `vue-jest`
      ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest",
      'vee-validate/dist/rules': 'babel-jest',
    },
    transformIgnorePatterns: [
      '<rootDir>/node_modules/(?!vee-validate/dist/rules)',
    ],
    snapshotSerializers: ["<rootDir>/node_modules/jest-serializer-vue"],
    collectCoverage: false,
    testPathIgnorePatterns: [
      "/node_modules/",
      "/.hubble/",
      "/TestConfigs/",
      "/TestUtils/"
    ]
  };